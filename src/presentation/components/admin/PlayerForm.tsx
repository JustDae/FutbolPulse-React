import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Player } from '@/domain/entities/player.entity';
import { useTeamStore } from '@/presentation/store/team.store';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';

const playerSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  jerseyNumber: z.number().int().min(1).max(99),
  position: z.enum(['Portero', 'Defensa', 'Mediocampista', 'Delantero']),
  teamId: z.string().min(1, 'Debes seleccionar un equipo'),
  isActive: z.boolean(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  player?: Player | null;
  isLoading?: boolean;
  onSubmit: (values: PlayerFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function PlayerForm({ player, isLoading = false, onSubmit, onCancel }: PlayerFormProps) {
  const { teams, fetchTeams } = useTeamStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: player?.name ?? '',
      jerseyNumber: player?.jerseyNumber ?? 10,
      position: player?.position ?? 'Mediocampista',
      teamId: player?.teamId ?? teams[0]?.id ?? '',
      isActive: player?.isActive ?? true,
    },
  });

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="player-name">Nombre completo</Label>
        <Input id="player-name" placeholder="Ej. Kendrick Páez" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="player-jerseyNumber">Dorsal</Label>
          <Input id="player-jerseyNumber" type="number" {...register('jerseyNumber', { valueAsNumber: true })} />
          {errors.jerseyNumber && (
            <p className="text-xs text-destructive">{errors.jerseyNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="player-position">Posición</Label>
          <select
            id="player-position"
            {...register('position')}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none"
          >
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Mediocampista">Mediocampista</option>
            <option value="Delantero">Delantero</option>
          </select>
          {errors.position && (
            <p className="text-xs text-destructive">{errors.position.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="player-teamId">Equipo</Label>
        <select
          id="player-teamId"
          {...register('teamId')}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none"
        >
          <option value="">Seleccionar equipo</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        {errors.teamId && <p className="text-xs text-destructive">{errors.teamId.message}</p>}
      </div>

      <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
        <input id="player-isActive" type="checkbox" {...register('isActive')} className="h-4 w-4" />
        <Label htmlFor="player-isActive" className="cursor-pointer">Jugador activo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : player ? 'Actualizar' : 'Crear jugador'}
        </Button>
      </div>
    </form>
  );
}
