import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { ImageUploader } from '../ImageUploader';
import { matchesCoach } from '@/presentation/utils/name.utils';

const playerSchema = z.object({
  firstNames: z.string().min(1, { message: 'Los nombres son obligatorios' }),
  lastNames: z.string().min(1, { message: 'Los apellidos son obligatorios' }),
  birthDate: z.string().min(1, { message: 'La fecha de nacimiento es obligatoria' }),
  jerseyNumber: z
    .number({ message: 'Debe ser un dorsal válido' })
    .int()
    .min(1, { message: 'Mínimo 1' })
    .max(99, { message: 'Máximo 99' }),
  position: z.enum(['Portero', 'Defensa', 'Mediocampista', 'Delantero']).optional().or(z.literal('')),
  teamId: z.string().min(1, { message: 'Debe pertenecer a un equipo' }),
  isActive: z.boolean(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface PlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: Player | null;
  defaultTeamId?: string;
}

export const PlayerDialog = ({ isOpen, onClose, playerToEdit, defaultTeamId }: PlayerDialogProps) => {
  const { createPlayer, updatePlayer, uploadPlayerPhoto, isLoading } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  const { user } = useAuthStore();

  const displayedTeams = useMemo(() => {
    return (user?.tipo_usuario === 'Coach' && !user?.is_staff)
      ? teams.filter(team => matchesCoach(team.coach, user.nombre_completo))
      : teams;
  }, [user, teams]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      birthDate: '',
      jerseyNumber: 10,
      position: undefined,
      teamId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen && teams.length === 0) {
      fetchTeams();
    }
  }, [isOpen, teams.length, fetchTeams]);

  useEffect(() => {
    if (playerToEdit) {
      reset({
        firstNames: playerToEdit.firstNames,
        lastNames: playerToEdit.lastNames,
        birthDate: playerToEdit.birthDate,
        jerseyNumber: playerToEdit.jerseyNumber,
        position: playerToEdit.position,
        teamId: playerToEdit.teamId,
        isActive: playerToEdit.isActive,
      });
    } else {
      reset({
        firstNames: '',
        lastNames: '',
        birthDate: '',
        jerseyNumber: 10,
        position: undefined,
        teamId: defaultTeamId || displayedTeams[0]?.id || '',
        isActive: true,
      });
    }
  }, [playerToEdit, reset, displayedTeams, defaultTeamId]);

  if (!isOpen) return null;

  const onSubmit = async (data: PlayerFormValues) => {
    try {
      const payload = {
        ...data,
        position: data.position === '' ? undefined : data.position,
      };

      if (playerToEdit) {
        await updatePlayer(playerToEdit.id, payload);
        toast.success('Jugador actualizado correctamente');
      } else {
        await createPlayer(payload);
        toast.success('Jugador creado correctamente');
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar jugador:', error);
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el jugador');
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (playerToEdit) {
      await uploadPlayerPhoto(playerToEdit.id, file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {playerToEdit ? 'Editar Jugador' : 'Registrar Nuevo Jugador'}
        </h2>

        {playerToEdit && (
          <div className="mb-6 flex flex-col items-center">
            <span className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Foto del Futbolista</span>
            <ImageUploader
              currentImageUrl={playerToEdit.photoUrl}
              onImageSelected={handlePhotoUpload}
              circular
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombres</label>
            <input
              type="text"
              {...register('firstNames')}
              className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="Ej. Kendry Páez"
            />
            {errors.firstNames && <p className="mt-1 text-xs text-red-500">{errors.firstNames.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Apellidos</label>
            <input
              type="text"
              {...register('lastNames')}
              className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="Ej. Páez Andrade"
            />
            {errors.lastNames && <p className="mt-1 text-xs text-red-500">{errors.lastNames.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Dorsal (#)</label>
              <input
                type="number"
                {...register('jerseyNumber', { valueAsNumber: true })}
                className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
              />
              {errors.jerseyNumber && <p className="mt-1 text-xs text-red-500">{errors.jerseyNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Fecha de nacimiento</label>
              <input
                type="date"
                {...register('birthDate')}
                className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
              />
              {errors.birthDate && <p className="mt-1 text-xs text-red-500">{errors.birthDate.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Posición</label>
            <select
              {...register('position')}
              className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="">Selecciona una posición...</option>
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Mediocampista">Mediocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
            {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Equipo</label>
            <select
              {...register('teamId')}
              className="mt-1 w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="">Selecciona un equipo...</option>
              {displayedTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.teamId && <p className="mt-1 text-xs text-red-500">{errors.teamId.message}</p>}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4" />
            <label htmlFor="isActive" className="text-sm font-medium">Jugador Activo</label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-zinc-800">
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
              {isLoading ? 'Guardando...' : playerToEdit ? 'Actualizar' : 'Crear Jugador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
