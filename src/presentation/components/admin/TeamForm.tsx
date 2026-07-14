import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Team } from '@/domain/entities/team.entity';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';

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

interface TeamFormProps {
  team?: Team | null;
  isLoading?: boolean;
  onSubmit: (values: TeamFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function TeamForm({ team, isLoading = false, onSubmit, onCancel }: TeamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name ?? '',
      coach: team?.coach ?? '',
      stadium: team?.stadium ?? '',
      foundedYear: team?.foundedYear ?? new Date().getFullYear(),
      isActive: team?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="team-name">Nombre del equipo</Label>
        <Input id="team-name" placeholder="Ej. Liga de Quito" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="team-coach">Director técnico</Label>
        <Input id="team-coach" placeholder="Nombre del entrenador" {...register('coach')} />
        {errors.coach && <p className="text-xs text-destructive">{errors.coach.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="team-stadium">Estadio</Label>
          <Input id="team-stadium" placeholder="Ej. Rodrigo Paz Delgado" {...register('stadium')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-foundedYear">Año de fundación</Label>
          <Input
            id="team-foundedYear"
            type="number"
            {...register('foundedYear', { valueAsNumber: true })}
          />
          {errors.foundedYear && (
            <p className="text-xs text-destructive">{errors.foundedYear.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
        <input id="team-isActive" type="checkbox" {...register('isActive')} className="h-4 w-4" />
        <Label htmlFor="team-isActive" className="cursor-pointer">Equipo activo en el torneo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : team ? 'Actualizar' : 'Crear equipo'}
        </Button>
      </div>
    </form>
  );
}
