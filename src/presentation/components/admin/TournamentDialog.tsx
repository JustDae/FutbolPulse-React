import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import type { Tournament } from '@/domain/entities/tournament.entity';
import { useTournamentStore } from '@/presentation/store/tournament.store';
import { useTeamStore } from '@/presentation/store/team.store';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const tournamentSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  entidadId: z.string().uuid('Debes seleccionar una entidad válida'),
  minAge: z.preprocess((val) => (val === '' || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  maxAge: z.preprocess((val) => (val === '' || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  gender: z.enum(['Masculino', 'Femenino', 'Mixto']),
  isActive: z.boolean(),
}).refine((data) => {
  if (data.minAge !== null && data.minAge !== undefined && data.maxAge !== null && data.maxAge !== undefined) {
    return data.maxAge >= data.minAge;
  }
  return true;
}, {
  path: ['maxAge'],
  message: 'La edad máxima no puede ser menor a la mínima',
});

type TournamentFormValues = z.infer<typeof tournamentSchema>;

interface TournamentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentToEdit?: Tournament | null;
}

export const TournamentDialog = ({ isOpen, onClose, tournamentToEdit }: TournamentDialogProps) => {
  const { createTournament, updateTournament, isLoading } = useTournamentStore();
  const { teams, fetchTeams } = useTeamStore();

  useEffect(() => {
    if (isOpen && teams.length === 0) {
      fetchTeams();
    }
  }, [isOpen, fetchTeams, teams.length]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema) as any,
    defaultValues: {
      name: '',
      entidadId: '',
      minAge: null,
      maxAge: null,
      gender: 'Masculino',
      isActive: true,
    },
  });

  useEffect(() => {
    if (tournamentToEdit) {
      reset({
        name: tournamentToEdit.name,
        entidadId: tournamentToEdit.entidadId,
        minAge: tournamentToEdit.minAge ?? null,
        maxAge: tournamentToEdit.maxAge ?? null,
        gender: (tournamentToEdit.gender as any) || 'Masculino',
        isActive: tournamentToEdit.isActive,
      });
    } else {
      reset({
        name: '',
        entidadId: '',
        minAge: null,
        maxAge: null,
        gender: 'Masculino',
        isActive: true,
      });
    }
  }, [tournamentToEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (tournamentToEdit) {
        await updateTournament(tournamentToEdit.id, data);
        toast.success('Torneo actualizado correctamente');
      } else {
        await createTournament(data);
        toast.success('Torneo creado correctamente');
      }
      onClose();
    } catch (error) {
      toast.error(tournamentToEdit ? 'No se pudo actualizar el torneo' : 'No se pudo crear el torneo');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {tournamentToEdit ? 'Editar torneo' : 'Crear nuevo torneo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entidadId">Entidad (Equipo)</Label>
            <select
              id="entidadId"
              {...register('entidadId')}
              className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
            >
              <option value="">-- Selecciona una entidad --</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.entidadId && <p className="text-xs text-red-500">{errors.entidadId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del torneo/categoría</Label>
            <Input id="name" placeholder="Ej. Liga Pro 2026" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <select
                id="gender"
                {...register('gender')}
                className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Mixto">Mixto</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Estado</Label>
              <div className="flex h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm dark:border-zinc-800">
                <input id="isActive" type="checkbox" {...register('isActive')} className="h-4 w-4" />
                <span>Activo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAge">Edad Mínima</Label>
              <Input id="minAge" type="number" {...register('minAge')} />
              {errors.minAge && <p className="text-xs text-red-500">{errors.minAge.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAge">Edad Máxima</Label>
              <Input id="maxAge" type="number" {...register('maxAge')} />
              {errors.maxAge && <p className="text-xs text-red-500">{errors.maxAge.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : tournamentToEdit ? 'Actualizar' : 'Crear torneo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
