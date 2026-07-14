import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import type { Team } from '../../../domain/entities/team.entity';
import { useTeamStore } from '../../store/team.store';

import { ImageUploader } from '../ImageUploader';

const teamSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  coach: z.string().min(3, 'El nombre del DT es obligatorio'),
  stadium: z.string().optional(),
  foundedYear: z
    .number({ message: 'Debe ser un año válido' }) 
    .int('Debe ser un número entero')
    .min(1850, 'Año no válido')
    .max(new Date().getFullYear(), 'El año no puede ser en el futuro'),
  isActive: z.boolean(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamToEdit?: Team | null;
}

export const TeamDialog = ({ isOpen, onClose, teamToEdit }: TeamDialogProps) => {
  const { createTeam, updateTeam, uploadTeamBadge, isLoading } = useTeamStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      coach: '',
      stadium: '',
      foundedYear: 2000,
      isActive: true,
    },
  });

  useEffect(() => {
    if (teamToEdit) {
      reset({
        name: teamToEdit.name,
        coach: teamToEdit.coach,
        stadium: teamToEdit.stadium || '',
        foundedYear: teamToEdit.foundedYear,
        isActive: teamToEdit.isActive,
      });
    } else {
      reset({
        name: '',
        coach: '',
        stadium: '',
        foundedYear: 2000,
        isActive: true,
      });
    }
  }, [teamToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: TeamFormValues) => {
    try {
      if (teamToEdit) {
        await updateTeam(teamToEdit.id, data);
        toast.success('Equipo actualizado correctamente');
      } else {
        await createTeam(data);
        toast.success('Equipo creado correctamente');
      }
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data 
        ? JSON.stringify(error.response.data)
        : 'Ocurrió un error al guardar el equipo';
      toast.error(msg);
      console.error('Error al guardar equipo:', error);
    }
  };

  const handleBadgeUpload = async (file: File) => {
    if (teamToEdit) {
      await uploadTeamBadge(teamToEdit.id, file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {teamToEdit ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
        </h2>

        {teamToEdit && (
          <div className="mb-6 flex flex-col items-center">
            <span className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Escudo del Club</span>
            <ImageUploader
              currentImageUrl={teamToEdit.badgeUrl}
              onImageSelected={handleBadgeUpload}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre del Equipo</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800"
              placeholder="Ej. Liga de Quito, Barcelona SC..."
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Director Técnico (DT)</label>
            <input
              type="text"
              {...register('coach')}
              className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800"
              placeholder="Nombre del entrenador"
            />
            {errors.coach && <p className="text-xs text-red-500 mt-1">{errors.coach.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Estadio principal</label>
              <input
                type="text"
                {...register('stadium')}
                className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800"
                placeholder="Ej. Rodrigo Paz Delgado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Año de Fundación</label>
              <input
                type="number"
                {...register('foundedYear', { valueAsNumber: true })}
                className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800"
              />
              {errors.foundedYear && <p className="text-xs text-red-500 mt-1">{errors.foundedYear.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4" />
            <label htmlFor="isActive" className="text-sm font-medium">Equipo Activo en el Torneo</label>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : teamToEdit ? 'Actualizar' : 'Crear Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};