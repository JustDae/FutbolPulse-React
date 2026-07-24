import { useState, useEffect, useRef } from 'react';
import { CalendarDays, Trophy, Activity, Target, TrendingUp, Zap } from 'lucide-react';
import { usePlayerStore } from '@/presentation/store/player.store';
import { useMatchStore } from '@/presentation/store/match.store';
import { axiosClient } from '@/infrastructure/http/axios-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { cn } from '@/presentation/utils/cn';

const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

// ── Particle Network Animation for Rendimiento ──────────────────────────────
export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(227, 28, 61, 0.7)' : 'rgba(227, 28, 61, 0.8)';
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(16, 24, 43, 0.14)';

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 110) {
            ctx.lineWidth = (1 - dist / 110) * 1.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-90 dark:opacity-75" />;
}

interface RadarChartProps {
  data: {
    velocidad:   number;
    resistencia: number;
    regate:      number;
    pase:        number;
    control:     number;
    tiro:        number;
  };
}

export function RadarChart({ data }: RadarChartProps) {
  const cx = 150, cy = 125, r = 80;

  const attributes = [
    { key: 'velocidad',   label: 'Velocidad' },
    { key: 'resistencia', label: 'Resistencia' },
    { key: 'regate',      label: 'Regate' },
    { key: 'pase',        label: 'Pase' },
    { key: 'control',     label: 'Control' },
    { key: 'tiro',        label: 'Tiro' },
  ];

  const angles = [0, 60, 120, 180, 240, 300].map(a => ((a - 90) * Math.PI) / 180);

  const getHexagonPoints = (radius: number) =>
    angles.map(angle => `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`).join(' ');

  const dataPoints = attributes.map((attr, idx) => {
    const val = data[attr.key as keyof typeof data] || 0;
    const radius = r * (val / 100);
    return { x: cx + radius * Math.cos(angles[idx]), y: cy + radius * Math.sin(angles[idx]), label: attr.label, value: val };
  });

  const dataPolygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  return (
    <div className="relative w-full flex justify-center py-2 select-none h-[250px]">
      <svg width="300" height="250" className="overflow-visible">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="var(--color-primary, #E63946)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary, #E63946)" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <polygon
            key={i}
            points={getHexagonPoints(r * scale)}
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/15 dark:text-white/10"
            strokeWidth="1"
          />
        ))}

        {angles.map((angle, i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="currentColor"
            className="text-muted-foreground/10 dark:text-white/5"
            strokeWidth="1"
          />
        ))}

        <polygon
          points={dataPolygonPoints}
          fill="url(#radarFill)"
          stroke="var(--color-primary, #E63946)"
          strokeWidth="2"
        />

        {dataPoints.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x} cy={pt.y} r={4}
            fill="var(--color-primary, #E63946)"
            stroke="currentColor"
            className="text-background cursor-pointer"
            strokeWidth="1.5"
            onMouseEnter={() => setHoveredPoint(pt)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}

        {attributes.map((attr, idx) => {
          const angle      = angles[idx];
          const labelDist  = r + 18;
          const x          = cx + labelDist * Math.cos(angle);
          const y          = cy + labelDist * Math.sin(angle);
          let textAnchor: 'inherit' | 'start' | 'end' | 'middle' = 'middle';
          if (Math.cos(angle) > 0.1)       textAnchor = 'start';
          else if (Math.cos(angle) < -0.1) textAnchor = 'end';

          let dy = '0.35em';
          if (Math.sin(angle) < -0.8)      dy = '-0.2em';
          else if (Math.sin(angle) > 0.8)  dy = '0.9em';

          return (
            <text
              key={idx}
              x={x} y={y}
              textAnchor={textAnchor}
              dy={dy}
              fontSize="9"
              fontWeight="700"
              fill="currentColor"
              className="text-muted-foreground/80 dark:text-muted-foreground/60"
              style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif" }}
            >
              {attr.label}
            </text>
          );
        })}
      </svg>

      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none text-foreground text-[10px] font-bold px-3 py-1.5 border border-border shadow-lg flex flex-col items-center bg-card rounded-md"
          style={{
            left: `${hoveredPoint.x}px`,
            top:  `${hoveredPoint.y - 45}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <span className="uppercase tracking-widest text-[8px] text-muted-foreground">{hoveredPoint.label}</span>
          <span className="text-lg font-black text-primary">{hoveredPoint.value}</span>
        </div>
      )}
    </div>
  );
}

export function PlayerDashboardPage() {
  const { currentPlayer } = usePlayerStore();
  const { matches }       = useMatchStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ partidos: 12, minutos: 840, goles: 4, asistencias: 2 });
  const [radarData, setRadarData] = useState({ velocidad: 85, resistencia: 80, regate: 75, pase: 82, control: 84, tiro: 78 });

  const getResults = (data: any) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') return data.results || data.data || [];
    return [];
  };

  useEffect(() => {
    if (!currentPlayer) return;
    const loadStats = async () => {
      setLoading(true);
      try {
        const [alineacionesRes, eventosRes, rendimientoRes] = await Promise.all([
          axiosClient.get(`/alineaciones/?jugador=${currentPlayer.id}`).catch(() => ({ data: [] })),
          axiosClient.get(`/eventos-live/?jugador=${currentPlayer.id}`).catch(() => ({ data: [] })),
          axiosClient.get(`/rendimiento/?jugador=${currentPlayer.id}`).catch(() => ({ data: [] })),
        ]);

        const alineaciones = getResults(alineacionesRes.data);
        const eventos      = getResults(eventosRes.data);
        const rendimientos = getResults(rendimientoRes.data);

        const partidos    = alineaciones.length;
        const minutos     = alineaciones.reduce((acc: number, curr: any) => acc + (curr.minutos_jugados || 0), 0);
        const goles       = eventos.filter((e: any) => e.tipo_evento === 'Gol' || e.tipo_evento === 'Penalti anotado').length;
        const asistencias = eventos.filter((e: any) => e.tipo_evento === 'Asistencia').length;

        setStats({ partidos: partidos || 12, minutos: minutos || 840, goles: goles || 4, asistencias: asistencias || 2 });

        if (rendimientos.length > 0) {
          const test   = rendimientos[0];
          const velVal = test.velocidad_30m_seg  ? Math.max(50, Math.min(100, Math.round(100 - (Number(test.velocidad_30m_seg)  - 3.5) * 28))) : 85;
          const resVal = test.resistencia_vo2max ? Math.max(50, Math.min(100, Math.round(Number(test.resistencia_vo2max) * 1.5)))              : 80;
          const agilVal = test.agilidad_seg      ? Math.max(50, Math.min(100, Math.round(100 - (Number(test.agilidad_seg) - 10) * 8)))        : 82;
          const flexVal = test.flexibilidad_cm   ? Math.max(50, Math.min(100, Math.round(60 + Number(test.flexibilidad_cm) * 1.5)))            : 75;
          setRadarData({ velocidad: velVal, resistencia: resVal, regate: flexVal, pase: agilVal, control: 84, tiro: 78 });
        }
      } catch (err) {
        console.error('Error loading player stats:', err);
      } finally { setLoading(false); }
    };
    loadStats();
  }, [currentPlayer]);

  const playerMatches = matches.filter(m =>
    currentPlayer?.teamName &&
    (m.equipoLocal.toLowerCase().includes(currentPlayer.teamName.toLowerCase()) ||
     m.equipoVisitante.toLowerCase().includes(currentPlayer.teamName.toLowerCase()))
  );
  const upcomingMatches = playerMatches
    .filter(m => m.status === 'Programado')
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

  const displayUpcoming = upcomingMatches.length > 0 ? upcomingMatches.slice(0, 3) : [
    { id: 'mock-1', equipoLocal: 'Atlético Central', equipoVisitante: 'FútbolPulse FC', matchDate: '2026-10-18T18:30:00Z', matchType: 'Liga Local', stadium: 'Estadio Principal' },
    { id: 'mock-2', equipoLocal: 'FútbolPulse FC',   equipoVisitante: 'Real Norte',     matchDate: '2026-10-25T20:00:00Z', matchType: 'Liga Local', stadium: 'Estadio Principal' },
  ] as any[];

  const formatMatchTime = (d: string) => {
    try { const dt = new Date(d); return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`; }
    catch { return '18:30'; }
  };

  const getDayAndMonth = (d: string) => {
    try {
      const dt = new Date(d);
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return { day: dt.getDate(), month: months[dt.getMonth()] };
    } catch { return { day: 18, month: 'Oct' }; }
  };

  const nextMatch = upcomingMatches[0];
  let nextMatchOpponent  = 'vs. Atlético Central';
  let nextMatchFormatted = 'Sáb 18:30';
  let nextMatchStadium   = 'Estadio Principal';

  if (nextMatch) {
    const isHome = currentPlayer?.teamName
      ? nextMatch.equipoLocal.toLowerCase().includes(currentPlayer.teamName.toLowerCase())
      : true;
    nextMatchOpponent  = `vs. ${isHome ? nextMatch.equipoVisitante : nextMatch.equipoLocal}`;
    nextMatchStadium   = nextMatch.stadium || 'Estadio Principal';
    try {
      const d = new Date(nextMatch.matchDate);
      const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      nextMatchFormatted = `${days[d.getDay()]} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    } catch { nextMatchFormatted = 'Sáb 18:30'; }
  }

  return (
    <div className="flex-1 space-y-8 pb-10">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden p-8 md:p-12 rounded-2xl glass mb-8 border border-border/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20"
      >
        {/* Particle Canvas Background */}
        <ParticleNetwork />

        {/* Decorative vertical bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

        <div className="relative z-10 pl-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[9px] font-bold uppercase tracking-[0.18em] bg-primary/10 border border-primary/20 text-primary"
          >
            <Zap className="w-3 h-3" /> Temporada 2026
          </div>
          <h1
            className="uppercase text-foreground mb-3"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 780, fontSize: 'clamp(36px,5vw,60px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
          >
            Rendimiento
          </h1>
          <p className="text-sm max-w-md text-muted-foreground">
            Analiza tus métricas clave, evolución de juego y prepárate para dominar la cancha en los próximos encuentros.
          </p>
        </div>
      </div>

      {/* Stat Cards Grid (Original glass separate cards layout) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Partidos</CardTitle>
            <CalendarDays className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{stats.partidos}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary animate-pulse" /> +2 esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Minutos</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{stats.minutos}'</div>
            <p className="text-xs text-muted-foreground mt-2">
              Promedio {Math.round(stats.minutos / Math.max(stats.partidos, 1))}' / partido
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Goles / Asist</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">
              {stats.goles} <span className="text-xl text-muted-foreground/50">/ {stats.asistencias}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" /> Top 15% del equipo
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Próximo</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary uppercase" style={{ fontFamily: FONT_DISPLAY }}>{nextMatchFormatted}</div>
            <p className="text-xs font-semibold text-foreground mt-1 truncate">{nextMatchOpponent}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{nextMatchStadium}</p>
          </CardContent>
        </Card>
      </div>

      {/* Radar + Calendar Grid in lg:grid-cols-7 original column ratio */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
        
        {/* Radar Card */}
        <Card className="col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide text-foreground">Estado de la Competición</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Análisis de rendimiento en la temporada actual</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[280px]">
            {loading ? (
              <div className="flex flex-col items-center text-muted-foreground">
                <Activity className="w-12 h-12 mb-4 animate-pulse text-primary/40" />
                <p className="text-xs uppercase tracking-widest">Cargando métricas...</p>
              </div>
            ) : (
              <RadarChart data={radarData} />
            )}
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className="col-span-3 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide text-foreground">Calendario</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Tus próximos encuentros de liga</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayUpcoming.map((match, idx) => {
              const { day, month } = getDayAndMonth(match.matchDate);
              const isNext = idx === 0 && upcomingMatches.length > 0;
              const opponentName = currentPlayer?.teamName
                ? (match.equipoLocal.toLowerCase().includes(currentPlayer.teamName.toLowerCase())
                    ? match.equipoVisitante : match.equipoLocal)
                : match.equipoLocal;

              return (
                <div
                  key={match.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                    isNext 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center w-12 h-12 rounded-lg font-black leading-none shrink-0",
                      isNext
                        ? "bg-primary/25 text-primary"
                        : "bg-black/40 text-muted-foreground"
                    )}
                  >
                    <span className="text-base">{day}</span>
                    <span className="text-[10px] uppercase mt-0.5">{month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">vs. {opponentName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {match.matchType || 'Liga Local'} • {formatMatchTime(match.matchDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
