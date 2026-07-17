import { CalendarDays, Trophy, Activity, Target } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';

export function PlayerDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white">
            Mi Rendimiento
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Revisa tus estadísticas y próximos encuentros
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-[#101010] border-gray-200 dark:border-[#1a1a1c] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">Partidos Jugados</CardTitle>
            <CalendarDays className="h-4 w-4 text-[#f94116]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">En la temporada actual</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-[#101010] border-gray-200 dark:border-[#1a1a1c] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">Minutos en Cancha</CardTitle>
            <Activity className="h-4 w-4 text-[#f94116]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0'</div>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Promedio de 0' por partido</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-[#101010] border-gray-200 dark:border-[#1a1a1c] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">Goles / Asistencias</CardTitle>
            <Target className="h-4 w-4 text-[#f94116]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0 / 0</div>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Participación directa</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-[#101010] border-gray-200 dark:border-[#1a1a1c] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f94116]/5 rounded-bl-full pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">Próximo Partido</CardTitle>
            <Trophy className="h-4 w-4 text-[#f94116]" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-[#f94116]">Sin partidos</div>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">No hay partidos programados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white dark:bg-[#101010] border-gray-200 dark:border-[#1a1a1c] shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Estado de la Competición</CardTitle>
            <CardDescription className="text-gray-500 dark:text-zinc-400">Resumen de tu categoría actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-[#1a1a1c] rounded-xl text-gray-400 dark:text-zinc-600 bg-gray-50/50 dark:bg-[#1a1a1c]/20">
              [Gráfico de Posiciones - Próximamente]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-white dark:bg-[#101010] border-gray-200 dark:border-[#1a1a1c] shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Calendario</CardTitle>
            <CardDescription className="text-gray-500 dark:text-zinc-400">Tus próximos encuentros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-[#1a1a1c] rounded-xl bg-gray-50/50 dark:bg-[#151515]">
                <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">No hay partidos próximos</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Tu equipo no tiene encuentros programados por el momento.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
