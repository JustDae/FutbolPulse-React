import { useState, useEffect } from 'react';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';
import { Play, ArrowRight, Layers, Wifi, Calendar, CheckCircle2, Activity } from 'lucide-react';
import { useTeamStore } from '@/presentation/store/team.store';
import { usePlayerStore } from '@/presentation/store/player.store';
import { useAuthStore } from '@/presentation/store/auth.store';
import heroBg from '@/assets/hero_bg.jpg';

const BG_CARD = '#0B0F19';
const BG_INNER = '#151D30';
const GREEN_BRAND = '#10B981';
const BORDER = 'rgba(255, 255, 255, 0.08)';

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-4">
      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#10B981]">{label}</span>
      <h2 className="text-sm font-bold text-white uppercase tracking-wider mt-1">{title}</h2>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden ${className}`}
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      {children}
    </div>
  );
}

function Skeleton({ h = 'h-12' }: { h?: string }) {
  return <div className={`${h} w-full animate-pulse rounded-md`} style={{ background: BG_INNER }} />;
}

export function MatchManagementPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMatch, setFeaturedMatch] = useState<Match | null>(null);
  const [news, setNews] = useState<{ title: string; date: string; image: string }[]>([]);
  const { teams, fetchTeams } = useTeamStore();
  const { players, fetchPlayers } = usePlayerStore();
  const { user } = useAuthStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedMatches] = await Promise.all([
        matchRepository.getMatches(),
        fetchPlayers(),
      ]);
      setMatches(fetchedMatches);
      if (fetchedMatches.length > 0) {
        const live = fetchedMatches.find(m => m.status === 'En curso');
        const scheduled = fetchedMatches.find(m => m.status === 'Programado');
        const finished = fetchedMatches.find(m => m.status === 'Finalizado');
        setFeaturedMatch(live || scheduled || finished || fetchedMatches[0]);
      }
    } catch (e) {
      console.error('Error fetching matches', e);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultNews = [
    { title: 'Bruno Fernandes brilló en el debut mundialista de Portugal', date: '24 Nov 2022', image: 'https://images.unsplash.com/photo-1518605368461-1ee7e5302a40?w=200&h=200&fit=crop' },
    { title: 'Uruguay empata y mantiene sus opciones de clasificar', date: '25 Nov 2022', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop' },
    { title: 'Corea del Sur da la sorpresa ante Ghana en la jornada 2', date: '28 Nov 2022', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&h=200&fit=crop' },
  ];

  const fetchNews = async () => {
    try {
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.skysports.com/rss/11095');
      const data = await response.json();
      if (data && data.items && Array.isArray(data.items)) {
        const items = data.items.slice(0, 3).map((i: any) => ({
          title: i.title,
          date: i.pubDate ? new Date(i.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Hoy',
          image: i.enclosure?.link || i.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&h=200&fit=crop',
        }));
        setNews(items);
      } else {
        setNews(defaultNews);
      }
    } catch (e) {
      console.error('Error fetching news', e);
      setNews(defaultNews);
    }
  };

  useEffect(() => {
    fetchTeams();
    setIsLoading(true);
    fetchData();
    fetchNews();
    const id = setInterval(() => {
      fetchData();
      fetchNews();
    }, 15000);
    return () => clearInterval(id);
  }, [fetchTeams]);

  const getTeamBadge = (teamName: string) => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase() || t.name.toLowerCase().includes(teamName.toLowerCase()) || teamName.toLowerCase().includes(t.name.toLowerCase()));
    return team?.badgeUrl || '';
  };

  const getDynamicStandings = () => {
    const standingsMap: { [key: string]: { teamName: string; badgeUrl: string; w: number; d: number; pts: number } } = {};

    teams.forEach(t => {
      standingsMap[t.name.toLowerCase()] = {
        teamName: t.name,
        badgeUrl: t.badgeUrl || '',
        w: 0,
        d: 0,
        pts: 0,
      };
    });

    matches.forEach(m => {
      if (m.status === 'Finalizado') {
        const home = m.equipoLocal.toLowerCase();
        const away = m.equipoVisitante.toLowerCase();
        const homeScore = m.homeScore ?? 0;
        const awayScore = m.awayScore ?? 0;

        if (standingsMap[home]) {
          standingsMap[home].w += homeScore > awayScore ? 1 : 0;
          standingsMap[home].d += homeScore === awayScore ? 1 : 0;
          standingsMap[home].pts += homeScore > awayScore ? 3 : (homeScore === awayScore ? 1 : 0);
        }

        if (standingsMap[away]) {
          standingsMap[away].w += awayScore > homeScore ? 1 : 0;
          standingsMap[away].d += awayScore === homeScore ? 1 : 0;
          standingsMap[away].pts += awayScore > homeScore ? 3 : (awayScore === homeScore ? 1 : 0);
        }
      }
    });

    return Object.values(standingsMap)
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 4);
  };

  const getDynamicLineup = (teamName: string) => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
    if (!team) return null;

    const teamPlayers = players.filter(p => p.teamId === team.id);
    if (teamPlayers.length === 0) return null;

    const defaultCoords = [
      { x: 50, y: 88 },
      { x: 35, y: 70 },
      { x: 65, y: 70 },
      { x: 15, y: 60 },
      { x: 85, y: 60 },
      { x: 30, y: 45 },
      { x: 70, y: 45 },
      { x: 50, y: 35 },
      { x: 25, y: 20 },
      { x: 75, y: 20 },
      { x: 50, y: 15 },
    ];

    return {
      formation: '4-3-3',
      players: teamPlayers.slice(0, 11).map((p, i) => ({
        id: p.id,
        number: p.jerseyNumber,
        name: p.lastNames || p.firstNames,
        x: defaultCoords[i]?.x ?? 50,
        y: defaultCoords[i]?.y ?? 50,
      })),
    };
  };

  const activeStandings = getDynamicStandings();
  const featuredHomeLineup = featuredMatch ? getDynamicLineup(featuredMatch.equipoLocal) : null;

  const coachName = user ? `${user.firstNames ?? ''} ${user.lastNames ?? ''}`.trim() || user.username || 'Coach' : 'Coach';
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches';
  const dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const liveCount   = matches.filter(m => m.status === 'En curso').length;
  const schedCount  = matches.filter(m => m.status === 'Programado').length;
  const doneCount   = matches.filter(m => m.status === 'Finalizado').length;
  const total       = matches.length;

  const statCards = [
    {
      label: 'Total Partidos',
      value: String(total || 0),
      icon: Layers,
      accent: '#10B981',
      bar: total > 0 ? 100 : 0,
      sub: 'registrados',
    },
    {
      label: 'En Vivo',
      value: String(liveCount),
      icon: Wifi,
      accent: '#EF4444',
      bar: total > 0 ? Math.round((liveCount / total) * 100) : 0,
      sub: liveCount === 1 ? 'en curso ahora' : 'en curso',
      pulse: liveCount > 0,
    },
    {
      label: 'Programados',
      value: String(schedCount),
      icon: Calendar,
      accent: '#3B82F6',
      bar: total > 0 ? Math.round((schedCount / total) * 100) : 0,
      sub: 'próximos',
    },
    {
      label: 'Finalizados',
      value: String(doneCount),
      icon: CheckCircle2,
      accent: '#A78BFA',
      bar: total > 0 ? Math.round((doneCount / total) * 100) : 0,
      sub: 'jugados',
    },
  ];

  return (
    <div className="w-full max-w-[1300px] animate-fade-in pb-10" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ─── HERO BANNER ─── */}
      <div
        className="relative w-full rounded-2xl overflow-hidden mb-8"
        style={{ minHeight: 180 }}
      >
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})`, filter: 'brightness(0.28) saturate(0.6)' }}
        />
        {/* green gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(16,185,129,0.18) 0%, transparent 60%, rgba(0,0,0,0.4) 100%)' }} />
        {/* left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: '#10B981' }} />

        <div className="relative flex items-center justify-between px-8 py-7 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#10B981' }}>
              {greeting}, {coachName}
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Gestión de Partidos
            </h1>
            <p className="text-[11px] text-white/40 mt-1.5 capitalize">{dateStr}</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Live pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#10B981]">Actualización en vivo</span>
            </div>
            {/* Activity icon */}
            <Activity size={28} className="text-white/10" />
          </div>
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, accent, bar, sub, pulse }) => (
          <div
            key={label}
            className="relative flex flex-col p-5 rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            {/* top accent strip */}
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: accent }} />

            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}22` }}>
                {pulse ? (
                  <span className="relative flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full animate-ping absolute" style={{ background: accent }} />
                    <Icon size={14} style={{ color: accent }} />
                  </span>
                ) : (
                  <Icon size={14} style={{ color: accent }} />
                )}
              </div>
            </div>

            <span className="text-4xl font-extrabold text-white leading-none mb-1">{value}</span>
            <span className="text-[10px] text-white/30 mb-3">{sub}</span>

            {/* progress bar */}
            <div className="h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-1 rounded-full transition-all duration-700"
                style={{ width: `${bar}%`, background: accent }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-6">
        <div className="space-y-6 flex flex-col">
          <Card className="flex-none">
            <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: BORDER }}>
              <SectionHeading label="Grupo H" title="Clasificación" />
            </div>
            <div className="flex items-center px-5 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white/40" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <span className="flex-1">Equipo</span>
              <span className="w-8 text-center">W</span>
              <span className="w-8 text-center">D</span>
              <span className="w-8 text-center">PTS</span>
            </div>
            {activeStandings.map((team, idx) => (
              <div
                key={team.teamName}
                className="flex items-center px-5 py-3 transition-colors hover:bg-white/5 cursor-pointer"
                style={{ borderBottom: idx < activeStandings.length - 1 ? `1px solid ${BORDER}` : 'none' }}
              >
                <span 
                  className="w-5 mr-3 text-center text-xs font-bold"
                  style={{ color: idx === 0 ? GREEN_BRAND : 'rgba(255,255,255,0.3)' }}
                >
                  {idx + 1}
                </span>
                {team.badgeUrl ? (
                  <img src={team.badgeUrl} alt={team.teamName} className="w-4 h-4 object-contain mr-3 shrink-0" />
                ) : (
                  <div className="w-4 h-4 bg-white/5 border border-white/10 text-[8px] font-bold flex items-center justify-center text-white/40 rounded mr-3 shrink-0">
                    {team.teamName.substring(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="flex-1 text-white text-xs font-semibold">{team.teamName}</span>
                <span className="w-8 text-center text-xs font-medium text-white/50">{team.w}</span>
                <span className="w-8 text-center text-xs font-medium text-white/30">{team.d}</span>
                <span 
                  className="w-8 text-center text-xs font-bold"
                  style={{ color: idx === 0 ? GREEN_BRAND : 'rgba(255,255,255,0.8)' }}
                >
                  {team.pts}
                </span>
              </div>
            ))}
            {activeStandings.length === 0 && (
              <p className="text-xs text-white/30 text-center py-8">Cargando clasificación...</p>
            )}
          </Card>

          <Card className="flex-1">
            <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: BORDER }}>
              <SectionHeading label="Calendario" title="Próximos Partidos" />
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-2"><Skeleton /><Skeleton /></div>
              ) : matches.length > 0 ? (
                matches.slice(0, 4).map((match, idx) => (
                  <div
                    key={match.id}
                    className="flex flex-col px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ borderBottom: idx < 3 ? `1px solid ${BORDER}` : 'none' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-xs font-semibold truncate max-w-[85px]">{match.equipoLocal}</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold text-white/40 bg-white/5 rounded">
                        VS
                      </span>
                      <span className="text-white text-xs font-semibold truncate max-w-[85px] text-right">{match.equipoVisitante}</span>
                    </div>
                    <p className="text-white/35 text-[9px] mt-2.5 font-semibold uppercase tracking-wider">
                      {new Date(match.matchDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white/30 text-xs text-center py-10">Sin partidos próximos</p>
              )}
            </div>

            <div className="p-4 border-t" style={{ borderColor: BORDER }}>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg">
                Ver calendario completo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6 flex flex-col">
          {isLoading ? (
            <Card className="h-[280px]"><Skeleton h="h-full" /></Card>
          ) : featuredMatch ? (
            <div className="relative border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between p-6" style={{ height: '280px', background: BG_CARD }}>
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src={heroBg}
                  alt="Stadium Background"
                  className="w-full h-full object-cover opacity-[0.22]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
              </div>

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  {featuredMatch.status === 'En curso' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E31C3D]/10 border border-[#E31C3D]/20 text-[9px] font-bold uppercase tracking-widest text-[#E31C3D]">
                      <span className="w-1 h-1 bg-[#E31C3D] rounded-full animate-ping" />
                      En Vivo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/50">
                      {featuredMatch.status}
                    </span>
                  )}
                  <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-2.5">
                    {featuredMatch.status === 'En curso' && featuredMatch.liveMinute ? `${featuredMatch.liveMinute}'` : 'Detalles del Partido'}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#151D30] hover:bg-[#1E293B] text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-lg shadow-sm">
                  <Play className="w-3 h-3 fill-white" /> Transmisión
                </button>
              </div>

              <div className="relative z-10 flex items-center justify-between my-2">
                <div className="flex-1 flex flex-col items-center text-center gap-2">
                  {getTeamBadge(featuredMatch.equipoLocal) ? (
                    <img src={getTeamBadge(featuredMatch.equipoLocal)} alt={featuredMatch.equipoLocal} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/10 bg-white/5">
                      {featuredMatch.equipoLocal.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                  <p className="text-white font-bold text-xs truncate max-w-[90px]">{featuredMatch.equipoLocal}</p>
                </div>

                <div className="text-center px-4 flex items-center gap-4">
                  <span className="text-4xl font-black text-white tracking-tight">
                    {featuredMatch.homeScore ?? '–'}
                  </span>
                  <span className="text-white/20 text-xl font-light">:</span>
                  <span className="text-4xl font-black text-white tracking-tight">
                    {featuredMatch.awayScore ?? '–'}
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center text-center gap-2">
                  {getTeamBadge(featuredMatch.equipoVisitante) ? (
                    <img src={getTeamBadge(featuredMatch.equipoVisitante)} alt={featuredMatch.equipoVisitante} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/10 bg-white/5">
                      {featuredMatch.equipoVisitante.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                  <p className="text-white font-bold text-xs truncate max-w-[90px]">{featuredMatch.equipoVisitante}</p>
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-3">
                <span className="text-white/40 text-[9px] font-semibold uppercase tracking-wider">Liga Profesional</span>
                <span className="text-white/40 text-[9px] font-medium">{featuredMatch.stadium || 'Estadio por confirmar'}</span>
              </div>
            </div>
          ) : (
            <Card className="h-[280px] flex items-center justify-center">
              <p className="text-white/30 text-xs font-medium">Sin partido en vivo</p>
            </Card>
          )}

          <Card className="flex-1">
            <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: BORDER }}>
              <SectionHeading label="Análisis" title="Estadísticas" />
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-4"><Skeleton /><Skeleton /><Skeleton /></div>
              ) : featuredMatch?.stats ? (
                <div className="space-y-5">
                  {(
                    [
                      ['Disparos', featuredMatch.stats.shots],
                      ['Al Arco', featuredMatch.stats.kickToGoal],
                      ['Posesión', featuredMatch.stats.possession],
                      ['Faltas', featuredMatch.stats.violations],
                      ['Tarj. Amarillas', featuredMatch.stats.yellowCards],
                      ['Tarj. Rojas', featuredMatch.stats.redCards],
                      ['Offside', featuredMatch.stats.offsides],
                      ['Corners', featuredMatch.stats.corners],
                    ] as [string, { home: number; away: number }][]
                  ).map(([label, stat]) => {
                    const total = (stat.home + stat.away) || 1;
                    const pHome = (stat.home / total) * 100;
                    const pAway = (stat.away / total) * 100;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">
                          <span>{stat.home}</span>
                          <span className="text-[9px] text-white/30">{label}</span>
                          <span>{stat.away}</span>
                        </div>
                        <div className="flex h-1.5 gap-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div
                            className="h-full transition-all duration-700 bg-slate-300"
                            style={{ width: `${pHome}%` }}
                          />
                          <div
                            className="h-full transition-all duration-700 bg-[#10B981]"
                            style={{ width: `${pAway}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-white/30 text-xs text-center py-8">Estadísticas no disponibles</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6 flex flex-col">
          <Card>
            <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: BORDER }}>
              <div className="flex items-start justify-between">
                <SectionHeading label="Alineación" title="Formación" />
                {featuredHomeLineup && (
                  <span className="text-[#10B981] text-xs font-bold mt-0.5">
                    {featuredHomeLineup.formation}
                  </span>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="p-4"><Skeleton h="h-48" /></div>
            ) : featuredMatch && featuredHomeLineup ? (
              <div className="p-4">
                <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '140%', background: '#0F1E15' }}>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 150"
                    preserveAspectRatio="none"
                    style={{ opacity: 0.25 }}
                  >
                    <rect x="4" y="4" width="92" height="142" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                    <line x1="4" y1="75" x2="96" y2="75" stroke="#FFFFFF" strokeWidth="0.8" />
                    <circle cx="50" cy="75" r="14" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                    <circle cx="50" cy="75" r="1" fill="#FFFFFF" />
                    <rect x="23" y="4" width="54" height="22" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                    <rect x="36" y="4" width="28" height="9" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                    <rect x="23" y="124" width="54" height="22" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                    <rect x="36" y="137" width="28" height="9" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                  </svg>
                  <div className="absolute inset-0 p-2">
                    {featuredHomeLineup.players.map((player) => (
                      <div
                        key={player.id}
                        className="absolute group"
                        style={{ left: `${player.x}%`, top: `${player.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        <div
                          className="flex items-center justify-center font-bold text-[9px] rounded-full text-white"
                          style={{
                            width: '20px',
                            height: '20px',
                            background: GREEN_BRAND,
                            border: '1.5px solid rgba(255,255,255,0.6)',
                          }}
                        >
                          {player.number}
                        </div>
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-1.5 py-0.5 text-[8px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 rounded bg-slate-900 text-white border border-white/10"
                        >
                          {player.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
                  {getTeamBadge(featuredMatch.equipoLocal) ? (
                    <img src={getTeamBadge(featuredMatch.equipoLocal)} alt={featuredMatch.equipoLocal} className="w-5 h-4 object-contain rounded-sm border border-white/10" />
                  ) : (
                    <div className="w-5 h-4 bg-white/5 border border-white/10 text-[8px] font-bold flex items-center justify-center text-white/40 rounded mr-1.5 shrink-0">
                      {featuredMatch.equipoLocal.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                  <span className="text-white text-xs font-bold">{featuredMatch.equipoLocal}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-white/25 text-xs">Formación no disponible</div>
            )}
          </Card>

          <Card className="flex-1">
            <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: BORDER }}>
              <SectionHeading label="Actualidad" title="Noticias" />
            </div>
            <div className="divide-y" style={{ borderColor: BORDER }}>
              {news.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3.5 p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 overflow-hidden shrink-0 rounded-md">
                    <img src={item.image} alt="Noticia" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-white text-[11px] font-semibold leading-snug line-clamp-2 group-hover:text-white/80 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wider mt-1.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
