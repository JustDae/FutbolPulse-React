import { Users, Star, FileText } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { KpiCard } from '@/presentation/components/KpiCard';

export function ScoutDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Ojeador</h2>
        <p className="text-muted-foreground">Bienvenido a tu panel de control de scouteo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Jugadores Observados"
          value={124}
          icon={<Users />}
          description="+12 esta semana"
        />
        <KpiCard
          title="Prospectos Destacados"
          value={15}
          icon={<Star />}
          description="Alta prioridad"
        />
        <KpiCard
          title="Reportes Creados"
          value={89}
          icon={<FileText />}
          description="Último hace 2 días"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Tus últimos reportes y evaluaciones de jugadores.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Aún no hay actividad reciente para mostrar en este dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
