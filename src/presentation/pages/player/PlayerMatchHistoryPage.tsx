import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Info, Activity, ArrowRight } from 'lucide-react';
import { usePlayerStore } from '@/presentation/store/player.store';
import { useMatchStore } from '@/presentation/store/match.store';
import { axiosClient } from '@/infrastructure/http/axios-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/presentation/utils/cn';

const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

// ── Tactical Play Board Animation for Mis Partidos ───────────────────────────
export function TacticalBoard() {
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

    const players = [
      { id: 'DEF', x: 0.22, y: 0.65, label: 'DEF', ox: 0, oy: 0, dx: 0.015, dy: 0.012 },
      { id: 'MED', x: 0.50, y: 0.35, label: 'MED', ox: 0, oy: 0, dx: -0.01, dy: 0.02 },
      { id: 'DEL', x: 0.78, y: 0.55, label: 'DEL', ox: 0, oy: 0, dx: 0.02, dy: -0.01 },
    ];

    let dashOffset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(16, 24, 43, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      
      ctx.strokeRect(width * 0.05, height * 0.1, width * 0.9, height * 0.8);
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.1);
      ctx.lineTo(width * 0.5, height * 0.9);
      ctx.stroke();

      players.forEach(p => {
        p.ox += p.dx;
        p.oy += p.dy;
        if (Math.abs(p.ox) > 10) p.dx *= -1;
        if (Math.abs(p.oy) > 10) p.dy *= -1;
      });

      const getCoords = (p: typeof players[0]) => ({
        x: width * p.x + p.ox,
        y: height * p.y + p.oy,
      });

      dashOffset = (dashOffset + 0.35) % 24;
      ctx.strokeStyle = isDark ? 'rgba(227, 28, 61, 0.4)' : 'rgba(227, 28, 61, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -dashOffset;

      const p1 = getCoords(players[0]);
      const p2 = getCoords(players[1]);
      const p3 = getCoords(players[2]);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 20, p2.x, p2.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.quadraticCurveTo((p2.x + p3.x) / 2, (p2.y + p3.y) / 2 + 15, p3.x, p3.y);
      ctx.stroke();

      ctx.setLineDash([]);
      players.forEach(p => {
        const { x, y } = getCoords(p);
        
        ctx.strokeStyle = 'rgba(227, 28, 61, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'var(--color-primary, #E31C3D)';
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.label, x, y);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-85 dark:opacity-75" />;
}

interface MatchHistoryItem {
  id: string;
  opponent: string;
  date: string;
  location: string;
  isHome: boolean;
  result: 'W' | 'L' | 'D' | null;
  score: string;
  started: boolean;
  minutesPlayed: number;
}

const DUMMY_HISTORY: MatchHistoryItem[] = [
  { id: '1', opponent: 'Brasil',   date: '10 Oct 2026', location: 'Estadio Nacional',  isHome: true,  result: 'W', score: '2 - 1', started: true,  minutesPlayed: 90 },
  { id: '2', opponent: 'Uruguay',  date: '05 Oct 2026', location: 'Estadio Centenario', isHome: false, result: 'D', score: '1 - 1', started: true,  minutesPlayed: 85 },
  { id: '3', opponent: 'Colombia', date: '28 Sep 2026', location: 'Estadio Nacional',  isHome: true,  result: 'L', score: '0 - 2', started: false, minutesPlayed: 30 },
];

export function PlayerMatchHistoryPage() {
  const { currentPlayer } = usePlayerStore();
  const { matches }       = useMatchStore();
  const [history,  setHistory]  = useState<MatchHistoryItem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!currentPlayer) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res         = await axiosClient.get(`/alineaciones/?jugador=${currentPlayer.id}`);
        const alineaciones = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || []);

        const items = alineaciones.map((alineacion: any) => {
          const match = matches.find(m => m.id === alineacion.partido);
          if (!match) return null;

          const isLocal = currentPlayer?.teamName
            ? match.equipoLocal.toLowerCase().includes(currentPlayer.teamName.toLowerCase())
            : true;
          const opponent   = isLocal ? match.equipoVisitante : match.equipoLocal;
          const score      = match.homeScore !== null && match.awayScore !== null
            ? `${match.homeScore} - ${match.awayScore}` : '0 - 0';

          let result: 'W' | 'L' | 'D' | null = null;
          if (match.status === 'Finalizado' && match.homeScore !== null && match.awayScore !== null) {
            const home = Number(match.homeScore), away = Number(match.awayScore);
            result = home === away ? 'D' : isLocal ? (home > away ? 'W' : 'L') : (away > home ? 'W' : 'L');
          }

          const formatDate = (s: string) => {
            try {
              const d = new Date(s);
              const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
              return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
            } catch { return s; }
          };

          return {
            id: alineacion.id, opponent, date: formatDate(match.matchDate),
            location: match.stadium || 'Estadio Principal', isHome: isLocal,
            result, score, started: alineacion.es_titular,
            minutesPlayed: alineacion.minutos_jugados || 0,
          };
        }).filter(Boolean) as MatchHistoryItem[];

        setHistory(items);
      } catch (err) { console.error('Error fetching history:', err); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [currentPlayer, matches]);

  const displayHistory = history.length > 0 ? history : DUMMY_HISTORY;

  const resultColors: Record<'W' | 'L' | 'D', { text: string; bg: string; border: string }> = {
    W: { text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    L: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    D: { text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  };

  const wins   = displayHistory.filter(m => m.result === 'W').length;
  const losses = displayHistory.filter(m => m.result === 'L').length;
  const draws  = displayHistory.filter(m => m.result === 'D').length;

  return (
    <div className="flex-1 space-y-8 pb-10">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden p-8 md:p-12 rounded-2xl glass mb-8 border border-border/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20"
      >
        {/* Tactical Play Board Animation */}
        <TacticalBoard />

        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="relative z-10 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-[2px] bg-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Historial
            </span>
          </div>
          <h1
            className="uppercase text-foreground mb-2"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 'clamp(36px,5vw,60px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
          >
            Mis Partidos
          </h1>
          <p className="text-sm text-muted-foreground">
            Resumen de tus participaciones en los últimos encuentros.
          </p>
        </div>
      </div>

      {/* Summary Stats Bar wrapped in an elegant glass Card */}
      <Card className="glass-card mb-8">
        <CardContent className="grid grid-cols-3 gap-6 py-6 text-center">
          {[
            { label: 'Victorias', value: wins,   color: '#22C55E' },
            { label: 'Empates',   value: draws,   color: '#EAB308' },
            { label: 'Derrotas',  value: losses,  color: 'var(--color-primary, #E31C3D)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center justify-center">
              <span className="font-black text-4xl leading-none animate-fade-in" style={{ fontFamily: FONT_DISPLAY, color }}>
                {value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Match List Card */}
      <Card className="glass-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-wide text-foreground">Historial Reciente</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-xs mt-1">Resumen detallado de participaciones.</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 bg-white/5 border-white/10">
              {displayHistory.length} partidos
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading && history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Activity className="w-8 h-8 animate-pulse mb-4 text-primary/45" />
              <p className="text-xs uppercase tracking-widest">Cargando historial de partidos...</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {displayHistory.map((match) => {
                const resCfg = match.result ? resultColors[match.result] : { text: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' };
                return (
                  <div
                    key={match.id}
                    className="flex flex-col md:flex-row items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors duration-250 first:rounded-t-none last:rounded-b-2xl"
                  >
                    <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                      {/* Result badge circle */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 shrink-0 font-black text-sm rounded-full border shadow-sm",
                          resCfg.bg, resCfg.text, resCfg.border
                        )}
                      >
                        {match.result ?? '?'}
                      </div>

                      <div>
                        <div className="font-bold text-foreground text-sm">
                          {match.score} <span className="text-muted-foreground/60">vs</span> {match.opponent}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar className="w-3 h-3 text-primary" /> {match.date}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MapPin className="w-3 h-3 text-primary" /> {match.isHome ? 'Local' : 'Visitante'} · {match.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                      <Badge variant={match.started ? 'default' : 'secondary'} className="px-3 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full">
                        {match.started ? 'Titular' : 'Suplente'}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {match.minutesPlayed}'
                      </div>
                      {!match.started && match.minutesPlayed === 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                          <Info className="w-3.5 h-3.5" /> No ingresó
                        </div>
                      )}
                      <ArrowRight className="hidden md:block w-4 h-4 ml-2 text-muted-foreground/30" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
