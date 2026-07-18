import { CalendarDays, Trophy, Activity, Target, TrendingUp, Zap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';

export function PlayerDashboardPage() {
  return (
    <div className="flex-1 space-y-8 animate-fade-in pb-10">
      {}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-3xl border border-primary/10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-4 neon-glow">
            <Zap className="w-3 h-3" /> Temporada 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">
            Rendimiento
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium max-w-md">
            Analiza tus métricas clave, evolución de juego y prepárate para dominar la cancha en los próximos encuentros.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Partidos</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">12</div>
            <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2 esta semana
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Minutos</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">840'</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Promedio 70' / partido</p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Goles / Asist</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">4 <span className="text-muted-foreground text-2xl font-bold">/ 2</span></div>
            <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Top 15% del equipo
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Próximo</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg neon-glow">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-black text-primary uppercase mt-1">Sáb 18:30</div>
            <p className="text-sm text-foreground font-bold mt-1">vs. Atlético Central</p>
            <p className="text-xs text-muted-foreground mt-1">Estadio Principal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase tracking-wide text-foreground">Estado de la Competición</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Análisis de rendimiento en la temporada actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-muted-foreground bg-black/20 backdrop-blur-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               <Activity className="w-12 h-12 text-primary/30 mb-4" />
               <p className="font-semibold z-10">Gráfico de Radar Interactivo</p>
               <p className="text-xs mt-2 z-10">Cargando métricas de rendimiento...</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase tracking-wide text-foreground">Calendario</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Tus próximos encuentros de liga</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                 <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary font-black leading-none">
                    <span>18</span>
                    <span className="text-[10px] uppercase">Oct</span>
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">vs. Atlético Central</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Liga Local • 18:30</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors opacity-70">
                 <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-black/40 text-muted-foreground font-black leading-none">
                    <span>25</span>
                    <span className="text-[10px] uppercase">Oct</span>
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">vs. Real Norte</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Liga Local • 20:00</p>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
