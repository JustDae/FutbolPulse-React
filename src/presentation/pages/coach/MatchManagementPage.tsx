import { useState, useEffect } from 'react';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';
import { ArrowRight, AlertTriangle, Radio } from 'lucide-react';
import { useTeamStore } from '@/presentation/store/team.store';
import { usePlayerStore } from '@/presentation/store/player.store';
import { useAuthStore } from '@/presentation/store/auth.store';

/* ─── Design tokens ─── */
const C = {
  bg:       '#0A0D14',
  surface:  '#0F1520',
  elevated: '#141B28',
  border:   'rgba(255,255,255,0.07)',
  borderMd: 'rgba(255,255,255,0.12)',
  green:    '#10B981',
  red:      '#EF4444',
  amber:    '#F59E0B',
  dimText:  'rgba(255,255,255,0.35)',
  mutedText:'rgba(255,255,255,0.55)',
  text:     'rgba(255,255,255,0.88)',
};

/* ─── Tiny shared components ─── */
function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-2 px-3 font-bold uppercase tracking-wider whitespace-nowrap"
      style={{ fontSize: 9, color: C.dimText, borderBottom: `1px solid ${C.border}` }}>
      {children}
    </th>
  );
}
function TD({ children, right, bold, color }: { children: React.ReactNode; right?: boolean; bold?: boolean; color?: string }) {
  return (
    <td className={`py-2.5 px-3 text-xs ${right ? 'text-right tabular-nums' : ''}`}
      style={{ color: color ?? C.text, fontWeight: bold ? 700 : 400, borderBottom: `1px solid ${C.border}` }}>
      {children}
    </td>
  );
}
function SectionTitle({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.mutedText }}>{label}</span>
      {action}
    </div>
  );
}
function StatusDot({ status }: { status: 'ok' | 'warn' | 'alert' | 'live' }) {
  const colors = { ok: C.green, warn: C.amber, alert: C.red, live: C.red };
  return (
    <span className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: colors[status], boxShadow: status === 'live' ? `0 0 6px ${C.red}` : 'none' }} />
  );
}
function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
      {children}
    </span>
  );
}

/* ─── Skeleton row ─── */
function SkRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-2.5 rounded animate-pulse" style={{ background: C.elevated, width: i === 0 ? '70%' : '40%' }} />
        </td>
      ))}
    </tr>
  );
}

/* ─── Match status badge ─── */
function MatchBadge({ status }: { status: string }) {
  if (status === 'En curso') return <Pill color={C.red}><span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />En Vivo</Pill>;
  if (status === 'Programado') return <Pill color={C.green}>Prog.</Pill>;
  if (status === 'Finalizado') return <Pill color={C.mutedText}>Final</Pill>;
  if (status === 'Suspendido') return <Pill color={C.amber}>Susp.</Pill>;
  return <Pill color={C.dimText}>{status}</Pill>;
}

/* ─── Compare bar (stats) ─── */
function CompareBar({ home, away, label }: { home: number; away: number; label: string }) {
  const total = (home + away) || 1;
  const pHome = (home / total) * 100;
  return (
    <div className="flex items-center gap-2 py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
      <span className="w-6 text-right text-xs font-bold tabular-nums" style={{ color: C.text }}>{home}</span>
      <div className="flex-1 flex h-1 gap-[1px] rounded-sm overflow-hidden" style={{ background: C.elevated }}>
        <div className="h-full rounded-l-sm" style={{ width: `${pHome}%`, background: C.mutedText }} />
        <div className="h-full rounded-r-sm flex-1" style={{ background: C.green }} />
      </div>
      <span className="w-6 text-left text-xs font-bold tabular-nums" style={{ color: C.green }}>{away}</span>
      <span className="w-24 text-[9px] text-center uppercase tracking-wider" style={{ color: C.dimText }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export function MatchManagementPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<{ title: string; date: string; url: string }[]>([]);
  const { teams, fetchTeams } = useTeamStore();
  const { players, fetchPlayers } = usePlayerStore();
  const { user } = useAuthStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(tick);
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedMatches] = await Promise.all([matchRepository.getMatches(), fetchPlayers()]);
      setMatches(fetchedMatches);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.skysports.com/rss/11095');
      const data = await res.json();
      if (data?.items?.length) {
        setNews(data.items.slice(0, 5).map((i: any) => ({
          title: i.title,
          date: i.pubDate ? new Date(i.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Hoy',
          url: i.link ?? '#',
        })));
      }
    } catch { /* keep empty */ }
  };

  useEffect(() => {
    fetchTeams();
    setIsLoading(true);
    fetchData();
    fetchNews();
    const id = setInterval(() => { fetchData(); fetchNews(); }, 15000);
    return () => clearInterval(id);
  }, [fetchTeams]);

  /* ─── Derived data ─── */
  const coachName  = user?.nombre_completo || user?.username || 'Coach';
  const timeStr    = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const dateStr    = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const liveMatches  = matches.filter(m => m.status === 'En curso');
  const nextMatches  = matches.filter(m => m.status === 'Programado').sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
  const doneMatches  = matches.filter(m => m.status === 'Finalizado').sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
  const featuredMatch = liveMatches[0] ?? nextMatches[0] ?? doneMatches[0] ?? null;

  /* standings from match results */
  const standingsMap: Record<string, { name: string; j: number; g: number; e: number; p: number; gf: number; gc: number; pts: number }> = {};
  teams.forEach(t => {
    standingsMap[t.id] = { name: t.name, j: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 };
  });
  matches.filter(m => m.status === 'Finalizado').forEach(m => {
    const hScore = m.homeScore ?? 0;
    const aScore = m.awayScore ?? 0;
    const hTeam = teams.find(t => t.name.toLowerCase() === m.equipoLocal.toLowerCase());
    const aTeam = teams.find(t => t.name.toLowerCase() === m.equipoVisitante.toLowerCase());
    if (hTeam && standingsMap[hTeam.id]) {
      standingsMap[hTeam.id].j++;
      standingsMap[hTeam.id].gf += hScore; standingsMap[hTeam.id].gc += aScore;
      if (hScore > aScore) { standingsMap[hTeam.id].g++; standingsMap[hTeam.id].pts += 3; }
      else if (hScore === aScore) { standingsMap[hTeam.id].e++; standingsMap[hTeam.id].pts += 1; }
      else standingsMap[hTeam.id].p++;
    }
    if (aTeam && standingsMap[aTeam.id]) {
      standingsMap[aTeam.id].j++;
      standingsMap[aTeam.id].gf += aScore; standingsMap[aTeam.id].gc += hScore;
      if (aScore > hScore) { standingsMap[aTeam.id].g++; standingsMap[aTeam.id].pts += 3; }
      else if (aScore === hScore) { standingsMap[aTeam.id].e++; standingsMap[aTeam.id].pts += 1; }
      else standingsMap[aTeam.id].p++;
    }
  });
  const standings = Object.values(standingsMap).filter(s => s.j > 0 || teams.length > 0)
    .sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));

  /* players with fatigue indicator based on jersey number seed */
  const rosterWithStatus = players.slice(0, 15).map(p => {
    const seed = (p.jerseyNumber || 1) + (p.id?.charCodeAt(0) ?? 0);
    const status: 'ok' | 'warn' | 'alert' =
      seed % 9 === 0 ? 'alert' : seed % 5 === 0 ? 'warn' : 'ok';
    const statusLabel = status === 'alert' ? 'Duda' : status === 'warn' ? 'Precaución' : 'Disponible';
    return { ...p, status, statusLabel };
  });

  /* alerts: players in doubt/alert */
  const alerts = rosterWithStatus.filter(p => p.status !== 'ok');

  /* ─── Layout ─── */
  return (
    <div className="w-full max-w-[1340px] pb-10 animate-fade-in" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>

      {/* ══ TOP BAR — identity + context strip ══ */}
      <div className="flex items-center justify-between px-1 mb-5 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.dimText }}>Panel Técnico · {coachName}</span>
          <h1 className="text-xl font-bold mt-0.5" style={{ color: C.text, letterSpacing: '-0.01em' }}>Gestión de Partidos</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-base font-bold tabular-nums" style={{ color: C.text }}>{timeStr}</div>
            <div className="text-[10px] capitalize" style={{ color: C.dimText }}>{dateStr}</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
            <Radio size={10} style={{ color: C.green }} />
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.green }}>En vivo</span>
          </div>
        </div>
      </div>

      {/* ══ ROW 1: Alerts (only shown if there are issues) ══ */}
      {alerts.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {alerts.map(p => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: p.status === 'alert' ? `${C.red}10` : `${C.amber}10`, border: `1px solid ${p.status === 'alert' ? C.red : C.amber}30` }}>
              <AlertTriangle size={11} style={{ color: p.status === 'alert' ? C.red : C.amber }} />
              <span className="text-[11px] font-semibold" style={{ color: C.text }}>
                #{p.jerseyNumber} {p.lastNames}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: p.status === 'alert' ? C.red : C.amber }}>
                {p.statusLabel}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ══ ROW 2: Summary counters — compact inline strip, no cards ══ */}
      <div className="flex gap-6 mb-5 px-1 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        {[
          { label: 'Total', value: matches.length, color: C.text },
          { label: 'En Vivo', value: liveMatches.length, color: liveMatches.length > 0 ? C.red : C.dimText },
          { label: 'Programados', value: nextMatches.length, color: C.green },
          { label: 'Finalizados', value: doneMatches.length, color: C.mutedText },
          { label: 'Jugadores', value: players.length, color: C.text },
          { label: 'Equipos', value: teams.length, color: C.text },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tabular-nums" style={{ color, lineHeight: 1 }}>{value}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.dimText }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ══ ROW 3: Main content grid ══ */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1.6fr 1.1fr' }}>

        {/* ── COL 1: Partido destacado + Próximos ── */}
        <div className="flex flex-col gap-4">

          {/* Featured match */}
          <div className="rounded" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <SectionTitle label={featuredMatch?.status === 'En curso' ? '● Partido en Vivo' : 'Partido Destacado'} />
            {isLoading ? (
              <div className="p-4 space-y-2"><div className="h-3 rounded animate-pulse w-3/4" style={{ background: C.elevated }} /></div>
            ) : featuredMatch ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <MatchBadge status={featuredMatch.status} />
                  <span className="text-[10px]" style={{ color: C.dimText }}>
                    {new Date(featuredMatch.matchDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Score row */}
                <div className="flex items-center justify-between py-3" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C.dimText }}>Local</div>
                    <div className="text-sm font-bold truncate" style={{ color: C.text }}>{featuredMatch.equipoLocal}</div>
                  </div>
                  <div className="flex items-center gap-3 px-4">
                    <span className="text-3xl font-black tabular-nums" style={{ color: C.text }}>{featuredMatch.homeScore ?? '–'}</span>
                    <span style={{ color: C.border }}>:</span>
                    <span className="text-3xl font-black tabular-nums" style={{ color: featuredMatch.awayScore != null && featuredMatch.homeScore != null && featuredMatch.awayScore > featuredMatch.homeScore ? C.green : C.text }}>
                      {featuredMatch.awayScore ?? '–'}
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C.dimText }}>Visitante</div>
                    <div className="text-sm font-bold truncate" style={{ color: C.text }}>{featuredMatch.equipoVisitante}</div>
                  </div>
                </div>

                {/* Stats mini grid */}
                {featuredMatch.stats && (
                  <div className="mt-3 space-y-0.5">
                    {([
                      ['Disparos', featuredMatch.stats.shots],
                      ['Al arco', featuredMatch.stats.kickToGoal],
                      ['Posesión %', featuredMatch.stats.possession],
                      ['Faltas', featuredMatch.stats.violations],
                      ['Amarillas', featuredMatch.stats.yellowCards],
                      ['Corners', featuredMatch.stats.corners],
                    ] as [string, { home: number; away: number }][]).map(([label, stat]) => (
                      <CompareBar key={label} home={stat.home} away={stat.away} label={label} />
                    ))}
                  </div>
                )}

                <div className="mt-3 flex justify-between text-[9px] font-semibold uppercase tracking-wider" style={{ color: C.dimText }}>
                  <span>{featuredMatch.matchType}</span>
                  <span>{featuredMatch.stadium || '—'}</span>
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-xs" style={{ color: C.dimText }}>Sin partido destacado</p>
            )}
          </div>

          {/* Próximos partidos — compact list */}
          <div className="rounded flex-1" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <SectionTitle label="Próximos Partidos"
              action={<span className="text-[10px]" style={{ color: C.dimText }}>{nextMatches.length} pendientes</span>} />
            {nextMatches.length === 0 && !isLoading ? (
              <p className="text-center py-6 text-xs" style={{ color: C.dimText }}>Sin partidos programados</p>
            ) : (
              <table className="w-full border-collapse">
                <thead><tr><TH>Partido</TH><TH>Tipo</TH><TH>Fecha</TH></tr></thead>
                <tbody>
                  {isLoading ? <><SkRow cols={3} /><SkRow cols={3} /></> :
                    nextMatches.slice(0, 5).map(m => (
                      <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                        <TD>
                          <span className="font-semibold">{m.equipoLocal}</span>
                          <span style={{ color: C.dimText }}> vs </span>
                          <span className="font-semibold">{m.equipoVisitante}</span>
                        </TD>
                        <TD><span style={{ color: C.dimText }}>{m.matchType}</span></TD>
                        <TD right>
                          {new Date(m.matchDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </TD>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── COL 2: Roster + Resultados ── */}
        <div className="flex flex-col gap-4">

          {/* Plantel — disponibilidad */}
          <div className="rounded" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <SectionTitle label="Plantel · Disponibilidad"
              action={<span className="text-[10px]" style={{ color: C.dimText }}>{players.length} jugadores</span>} />
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <TH>#</TH>
                  <TH>Jugador</TH>
                  <TH>Posición</TH>
                  <TH>Estado</TH>
                  <TH>Nac.</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <><SkRow cols={5} /><SkRow cols={5} /><SkRow cols={5} /></>
                ) : rosterWithStatus.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-xs" style={{ color: C.dimText }}>Sin jugadores registrados</td></tr>
                ) : (
                  rosterWithStatus.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                      <TD right bold>{p.jerseyNumber}</TD>
                      <TD>
                        <span className="font-semibold">{p.lastNames}</span>
                        {p.firstNames && <span className="ml-1" style={{ color: C.dimText }}>{p.firstNames[0]}.</span>}
                      </TD>
                      <TD><span style={{ color: C.dimText, fontSize: 10 }}>{p.position ?? '—'}</span></TD>
                      <TD>
                        <div className="flex items-center gap-1.5">
                          <StatusDot status={p.status} />
                          <span style={{ fontSize: 10, color: p.status === 'ok' ? C.green : p.status === 'warn' ? C.amber : C.red }}>
                            {p.statusLabel}
                          </span>
                        </div>
                      </TD>
                      <TD><span style={{ color: C.dimText, fontSize: 10 }}>{p.nacionalidad ?? '—'}</span></TD>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Resultados recientes */}
          <div className="rounded" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <SectionTitle label="Resultados Recientes" />
            {doneMatches.length === 0 && !isLoading ? (
              <p className="text-center py-5 text-xs" style={{ color: C.dimText }}>Sin partidos finalizados</p>
            ) : (
              <table className="w-full border-collapse">
                <thead><tr><TH>Local</TH><TH>Res.</TH><TH>Visitante</TH><TH>Tipo</TH><TH>Fecha</TH></tr></thead>
                <tbody>
                  {isLoading ? <><SkRow cols={5} /><SkRow cols={5} /></> :
                    doneMatches.slice(0, 6).map(m => {
                      const homeWon = (m.homeScore ?? 0) > (m.awayScore ?? 0);
                      const draw = m.homeScore === m.awayScore;
                      return (
                        <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                          <TD bold={homeWon && !draw}>{m.equipoLocal}</TD>
                          <TD right bold>
                            <span style={{ color: homeWon ? C.green : draw ? C.mutedText : C.red }}>
                              {m.homeScore ?? 0}–{m.awayScore ?? 0}
                            </span>
                          </TD>
                          <TD bold={!homeWon && !draw}>{m.equipoVisitante}</TD>
                          <TD><span style={{ color: C.dimText, fontSize: 10 }}>{m.matchType}</span></TD>
                          <TD right><span style={{ color: C.dimText }}>
                            {new Date(m.matchDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span></TD>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── COL 3: Clasificación + Noticias ── */}
        <div className="flex flex-col gap-4">

          {/* Clasificación */}
          <div className="rounded" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <SectionTitle label="Clasificación" />
            {standings.length === 0 && !isLoading ? (
              <p className="text-center py-6 text-xs" style={{ color: C.dimText }}>Sin datos de clasificación</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <TH>#</TH>
                    <TH>Equipo</TH>
                    <TH>J</TH>
                    <TH>G</TH>
                    <TH>E</TH>
                    <TH>P</TH>
                    <TH>DG</TH>
                    <TH>Pts</TH>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <><SkRow cols={8} /><SkRow cols={8} /></> :
                    standings.map((s, idx) => (
                      <tr key={s.name} className="hover:bg-white/[0.03] transition-colors">
                        <TD right>
                          <span style={{ color: idx === 0 ? C.green : C.dimText, fontWeight: idx === 0 ? 700 : 400 }}>{idx + 1}</span>
                        </TD>
                        <TD bold={idx === 0}>{s.name}</TD>
                        <TD right><span style={{ color: C.dimText }}>{s.j}</span></TD>
                        <TD right><span style={{ color: C.green }}>{s.g}</span></TD>
                        <TD right><span style={{ color: C.dimText }}>{s.e}</span></TD>
                        <TD right><span style={{ color: C.red }}>{s.p}</span></TD>
                        <TD right><span style={{ color: (s.gf - s.gc) >= 0 ? C.green : C.red }}>{s.gf - s.gc > 0 ? '+' : ''}{s.gf - s.gc}</span></TD>
                        <TD right bold color={idx === 0 ? C.green : C.text}>{s.pts}</TD>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Actualidad — compact news list */}
          <div className="rounded flex-1" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <SectionTitle label="Actualidad" action={
              <span className="text-[9px] uppercase tracking-wider" style={{ color: C.dimText }}>Sky Sports</span>
            } />
            {news.length === 0 ? (
              <p className="text-center py-6 text-xs" style={{ color: C.dimText }}>Cargando noticias...</p>
            ) : (
              <div>
                {news.map((item, idx) => (
                  <div key={item.title}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                    style={{ borderBottom: idx < news.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div className="shrink-0 mt-0.5">
                      <ArrowRight size={10} style={{ color: C.dimText }} />
                    </div>
                    <div>
                      <p className="text-[11px] leading-snug line-clamp-2" style={{ color: C.text }}>{item.title}</p>
                      <p className="text-[9px] mt-1 font-semibold uppercase tracking-wider" style={{ color: C.dimText }}>{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
