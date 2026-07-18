import { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { usePlayerStore } from '@/presentation/store/player.store';
import { useMatchStore } from '@/presentation/store/match.store';
import { axiosClient } from '@/infrastructure/http/axios-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/presentation/utils/cn';

const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

// ── Tactical Heatmap Animation for Retroalimentación ─────────────────────────
export function HeatmapAnimation() {
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

    const points = [
      { x: width * 0.25, y: height * 0.5,  r: 95,  vx: 0.35, vy: 0.25, color: 'rgba(227, 28, 61, 0.42)' },  
      { x: width * 0.55, y: height * 0.35, r: 125, vx: -0.25, vy: 0.3, color: 'rgba(234, 179, 8, 0.36)' },  
      { x: width * 0.8,  y: height * 0.6,  r: 110, vx: 0.3, vy: -0.35, color: 'rgba(34, 197, 94, 0.32)' },  
      { x: width * 0.4,  y: height * 0.7,  r: 85,  vx: -0.35, vy: -0.3, color: 'rgba(227, 28, 61, 0.38)' },  
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';

      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x - p.r < 0 || p.x + p.r > width) p.vx *= -1;
        if (p.y - p.r < 0 || p.y + p.r > height) p.vy *= -1;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';

      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(16, 24, 43, 0.2)';
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(16, 24, 43, 0.2)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(width * 0.5, 0);
      ctx.lineTo(width * 0.5, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, 45, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeRect(-5, height * 0.2, width * 0.12, height * 0.6);
      ctx.strokeRect(width * 0.88, height * 0.2, width * 0.12 + 5, height * 0.6);
      
      ctx.beginPath();
      ctx.arc(width * 0.08, height * 0.5, 2.5, 0, Math.PI * 2);
      ctx.arc(width * 0.92, height * 0.5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

interface FeedbackItem {
  id: string;
  matchId: string;
  opponent: string;
  date: string;
  rating: number;
  comments: string;
  coachName: string;
}

const DEFAULT_FEEDBACK: FeedbackItem[] = [
  {
    id: '1', matchId: '1', opponent: 'Brasil', date: '10 Oct 2026', rating: 9.0,
    comments: 'Aspectos destacados: Excelente desempeño táctico en el segundo tiempo. Mantuviste bien la posición y fuiste clave en la recuperación del balón.',
    coachName: 'DT. Scaloni',
  },
  {
    id: '2', matchId: '2', opponent: 'Uruguay', date: '05 Oct 2026', rating: 6.0,
    comments: 'Áreas de mejora: Faltó intensidad en los primeros minutos. Necesitamos trabajar más la presión alta en los entrenamientos de la semana.',
    coachName: 'DT. Scaloni',
  },
];

export function PlayerFeedbackPage() {
  const { currentPlayer } = usePlayerStore();
  const { matches }       = useMatchStore();
  const [evaluations, setEvaluations] = useState<FeedbackItem[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!currentPlayer) return;
    const fetchEvaluations = async () => {
      setLoading(true);
      try {
        const res  = await axiosClient.get(`/evaluacion-post-partido/?jugador=${currentPlayer.id}`);
        const data = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || []);
        const visible = data.filter((e: any) => e.es_visible_jugador);

        const items = visible.map((evalItem: any) => {
          const match   = matches.find(m => m.id === evalItem.partido);
          const isLocal = currentPlayer?.teamName
            ? match?.equipoLocal.toLowerCase().includes(currentPlayer.teamName.toLowerCase())
            : true;
          const opponent = match ? (isLocal ? match.equipoVisitante : match.equipoLocal) : 'Rival';

          const formatDate = (s: string) => {
            try {
              const d = new Date(s);
              const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
              return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
            } catch { return ''; }
          };

          let comments = '';
          if (evalItem.puntos_positivos) comments += `Aspectos destacados: ${evalItem.puntos_positivos}`;
          if (evalItem.puntos_a_mejorar) {
            if (comments) comments += '\n\n';
            comments += `Áreas de mejora: ${evalItem.puntos_a_mejorar}`;
          }
          if (!comments) comments = 'Sin comentarios específicos registrados.';

          return {
            id: evalItem.id, matchId: evalItem.partido, opponent,
            date: match ? formatDate(match.matchDate) : '',
            rating: Number(evalItem.calificacion), comments, coachName: 'Cuerpo Técnico',
          };
        });

        setEvaluations(items);
      } catch (err) { console.error('Error fetching evaluations:', err); }
      finally { setLoading(false); }
    };
    fetchEvaluations();
  }, [currentPlayer, matches]);

  const displayEvaluations = evaluations.length > 0 ? evaluations : DEFAULT_FEEDBACK;
  const avgRating = displayEvaluations.length > 0
    ? (displayEvaluations.reduce((acc, curr) => acc + curr.rating, 0) / displayEvaluations.length).toFixed(1)
    : '0.0';

  const getRatingColorClass = (r: number) =>
    r >= 8 ? 'text-green-500 bg-green-500/10 border-green-500/20' : 
    r >= 6 ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 
    'text-primary bg-primary/10 border-primary/20';

  return (
    <div className="flex-1 space-y-8 pb-10">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden p-8 md:p-12 rounded-2xl glass mb-8 border border-border/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20"
      >
        {/* Animated Tactical Heatmap Background */}
        <HeatmapAnimation />

        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="relative z-10 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-[2px] bg-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Retroalimentación
            </span>
          </div>
          <h1
            className="uppercase text-foreground mb-2"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(36px,5vw,60px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
          >
            Evaluaciones Técnicas
          </h1>
          <p className="text-sm text-muted-foreground">
            Retroalimentación del cuerpo técnico sobre tu desempeño en cada encuentro.
          </p>
        </div>
      </div>

      {/* Summary Stats Grid wrapped in a rounded glass Card */}
      <Card className="glass-card mb-8">
        <CardContent className="grid grid-cols-2 gap-6 py-6 text-center divide-x divide-border/50">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span
                className="font-black text-4xl leading-none text-yellow-500 animate-pulse"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {avgRating}
              </span>
              <span className="text-lg font-bold text-muted-foreground/40">/ 10</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 text-muted-foreground">
              Calificación Promedio
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span
                className="font-black text-4xl leading-none text-green-500"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                +0.5
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 text-muted-foreground">
              Tendencia (vs mes anterior)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations List Card */}
      <Card className="glass-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-wide text-foreground">Evaluaciones del DT</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-xs mt-1">Historial de calificaciones y observaciones.</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 bg-white/5 border-white/10">
              {displayEvaluations.length} registros
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading && evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Activity className="w-8 h-8 animate-pulse mb-4 text-primary/45" />
              <p className="text-xs uppercase tracking-widest">Cargando evaluaciones...</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {displayEvaluations.map((feedback) => {
                const ratingClass = getRatingColorClass(feedback.rating);
                return (
                  <div
                    key={feedback.id}
                    className="hover:bg-white/5 transition-colors duration-250 first:rounded-t-none last:rounded-b-2xl"
                  >
                    {/* Item header */}
                    <div
                      className="flex items-center justify-between px-6 py-4 bg-muted/20 border-b border-border/40"
                    >
                      <div>
                        <div className="font-bold text-foreground text-sm">vs {feedback.opponent}</div>
                        <div className="text-[10px] mt-0.5 text-muted-foreground">{feedback.date}</div>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 border rounded-full shadow-sm",
                          ratingClass
                        )}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span
                          className="font-black text-sm"
                          style={{ fontFamily: FONT_DISPLAY }}
                        >
                          {feedback.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <div className="px-6 py-5 flex gap-4">
                      <div className="shrink-0 mt-0.5">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-sm leading-relaxed whitespace-pre-line text-foreground/90"
                        >
                          {feedback.comments}
                        </p>
                        <p
                          className="text-[9px] font-bold uppercase tracking-widest mt-4 text-primary"
                        >
                          — {feedback.coachName}
                        </p>
                      </div>
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
