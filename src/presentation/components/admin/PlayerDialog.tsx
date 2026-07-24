import { useEffect, useMemo, useState } from 'react';
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
import { useSubscriptionStore } from '../../store/subscription.store';
import { PremiumGate } from '../PremiumGate';
import { Lock } from 'lucide-react';

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

  const { isPremium } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<'info' | 'salud' | 'tests' | 'economia'>('info');

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
      <div className="w-full max-w-2xl rounded-lg bg-[#0A0E14] p-6 shadow-xl border border-[#2D3748] text-white">
        <h2 className="mb-4 text-xl font-bold uppercase tracking-tight text-white">
          {playerToEdit ? 'Ficha del Jugador' : 'Registrar Nuevo Jugador'}
        </h2>

        {playerToEdit && (
          <div className="flex items-center gap-4 border-b border-[#2D3748] pb-4 mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors shrink-0 ${
                activeTab === 'info' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
              }`}
            >
              Información Técnica
            </button>
            <button
              onClick={() => setActiveTab('salud')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'salud' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
              }`}
            >
              Salud y Lesiones
              {!isPremium && <Lock className="w-3 h-3 text-[#D4AF37]" />}
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'tests' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
              }`}
            >
              Tests Físicos
              {!isPremium && <Lock className="w-3 h-3 text-[#D4AF37]" />}
            </button>
            <button
              onClick={() => setActiveTab('economia')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'economia' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
              }`}
            >
              Valoración Económica
              {!isPremium && <Lock className="w-3 h-3 text-[#D4AF37]" />}
            </button>
          </div>
        )}

        {activeTab === 'info' || !playerToEdit ? (
          <div className="bg-[#121820] p-4 rounded-xl border border-[#2D3748]">
            {playerToEdit && (
              <div className="mb-6 flex flex-col items-center">
                <span className="mb-2 text-xs font-bold uppercase tracking-wider text-[#A0AEC0]">Foto del Futbolista</span>
                <ImageUploader
                  currentImageUrl={playerToEdit.photoUrl}
                  onImageSelected={handlePhotoUpload}
                  circular
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Nombres</label>
                  <input
                    type="text"
                    {...register('firstNames')}
                    className="w-full rounded-xl border p-2.5 text-sm bg-[#0B1220] border-[#2D3748] focus:border-[#E63946] focus:outline-none"
                    placeholder="Ej. Kendry Páez"
                  />
                  {errors.firstNames && <p className="mt-1 text-xs text-[#E63946]">{errors.firstNames.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Apellidos</label>
                  <input
                    type="text"
                    {...register('lastNames')}
                    className="w-full rounded-xl border p-2.5 text-sm bg-[#0B1220] border-[#2D3748] focus:border-[#E63946] focus:outline-none"
                    placeholder="Ej. Páez Andrade"
                  />
                  {errors.lastNames && <p className="mt-1 text-xs text-[#E63946]">{errors.lastNames.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Dorsal (#)</label>
                  <input
                    type="number"
                    {...register('jerseyNumber', { valueAsNumber: true })}
                    className="w-full rounded-xl border p-2.5 text-sm bg-[#0B1220] border-[#2D3748] focus:border-[#E63946] focus:outline-none"
                  />
                  {errors.jerseyNumber && <p className="mt-1 text-xs text-[#E63946]">{errors.jerseyNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    {...register('birthDate')}
                    className="w-full rounded-xl border p-2.5 text-sm bg-[#0B1220] border-[#2D3748] focus:border-[#E63946] focus:outline-none"
                  />
                  {errors.birthDate && <p className="mt-1 text-xs text-[#E63946]">{errors.birthDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Posición</label>
                  <select
                    {...register('position')}
                    className="w-full rounded-xl border p-2.5 text-sm bg-[#0B1220] border-[#2D3748] focus:border-[#E63946] focus:outline-none"
                  >
                    <option value="">Selecciona una posición...</option>
                    <option value="Portero">Portero</option>
                    <option value="Defensa">Defensa</option>
                    <option value="Mediocampista">Mediocampista</option>
                    <option value="Delantero">Delantero</option>
                  </select>
                  {errors.position && <p className="mt-1 text-xs text-[#E63946]">{errors.position.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A0AEC0] mb-1">Equipo</label>
                  <select
                    {...register('teamId')}
                    className="w-full rounded-xl border p-2.5 text-sm bg-[#0B1220] border-[#2D3748] focus:border-[#E63946] focus:outline-none"
                  >
                    <option value="">Selecciona un equipo...</option>
                    {displayedTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {errors.teamId && <p className="mt-1 text-xs text-[#E63946]">{errors.teamId.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4 accent-[#E63946]" />
                <label htmlFor="isActive" className="text-sm font-bold">Jugador Activo</label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-[#2D3748] pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-[#2D3748] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#3f4a5c] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-[#E63946] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c42838] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : playerToEdit ? 'Actualizar' : 'Crear Jugador'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {activeTab === 'salud' && (
          <PremiumGate featureName="Historial Médico y Lesiones">
            <div className="bg-[#121820] p-8 rounded-xl border border-[#2D3748] text-center">
              <h3 className="text-xl font-bold text-white mb-2">Panel Médico</h3>
              <p className="text-[#A0AEC0] text-sm">Aquí se gestionarán los partes médicos del jugador.</p>
            </div>
          </PremiumGate>
        )}

        {activeTab === 'tests' && (
          <PremiumGate featureName="Tests de Rendimiento">
            <div className="bg-[#121820] p-8 rounded-xl border border-[#2D3748] text-center">
              <h3 className="text-xl font-bold text-white mb-2">Evaluación Física</h3>
              <p className="text-[#A0AEC0] text-sm">Aquí se registrarán los tests de resistencia, fuerza y velocidad.</p>
            </div>
          </PremiumGate>
        )}

        {activeTab === 'economia' && (
          <PremiumGate featureName="Valoración Económica">
            <div className="bg-[#121820] p-8 rounded-xl border border-[#2D3748] text-center">
              <h3 className="text-xl font-bold text-white mb-2">Valor de Mercado</h3>
              <p className="text-[#A0AEC0] text-sm">Aquí se gestionará la cláusula, salario y valor de traspaso del jugador.</p>
            </div>
          </PremiumGate>
        )}
      </div>
    </div>
  );
};
