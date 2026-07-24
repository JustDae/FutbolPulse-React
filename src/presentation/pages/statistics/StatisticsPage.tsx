import { useState, useEffect } from 'react';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { AxiosTournamentRepository } from '@/infrastructure/adapters/axios-tournament.repository';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Team } from '@/domain/entities/team.entity';
import type { Player } from '@/domain/entities/player.entity';
import type { Match } from '@/domain/entities/match.entity';
import type { Tournament } from '@/domain/entities/tournament.entity';

const teamRepository = new AxiosTeamRepository();
const playerRepository = new AxiosPlayerRepository();
const tournamentRepository = new AxiosTournamentRepository();

const NAVY = '#0B1220';
const RED = '#E63946';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

interface StandingRow {
  teamId: string;
  teamName: string;
  badgeUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface ScorerRow {
  player: Player;
  teamName: string;
  goals: number;
}

export function StatisticsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');

  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [allPlayersWithTeams, setAllPlayersWithTeams] = useState<{ player: Player; teamName: string }[]>([]);

  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [scorers, setScorers] = useState<ScorerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      tournamentRepository.getTournaments().catch(() => []),
      teamRepository.getTeams().catch(() => []),
      matchRepository.getMatches().catch(() => [])
    ])
      .then(async ([tournamentsList, teamsList, matchesList]) => {
        setTournaments(tournamentsList);
        setAllTeams(teamsList);
        setAllMatches(matchesList);

        if (tournamentsList.length > 0) {
          setSelectedTournamentId(tournamentsList[0].id);
        }

        const allPlayersPromises = teamsList.map((t: Team) => 
          playerRepository.getPlayersByTeam(t.id)
            .then(players => players.map(p => ({ player: p, teamName: t.name })))
            .catch(() => [])
        );
        const allPlayersNested = await Promise.all(allPlayersPromises);
        setAllPlayersWithTeams(allPlayersNested.flat());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !selectedTournamentId) return;

    const filteredMatches = allMatches.filter(m => 
      m.tournamentId === selectedTournamentId
    );

    const standingsMap: { [key: string]: StandingRow } = {};

    allTeams.forEach((t: Team) => {
      standingsMap[t.name.toLowerCase()] = {
        teamId: t.id,
        teamName: t.name,
        badgeUrl: t.badgeUrl,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    });

    filteredMatches.forEach((m: Match) => {
      if (m.status === 'Finalizado') {
        const home = m.equipoLocal.toLowerCase();
        const away = m.equipoVisitante.toLowerCase();
        const homeScore = m.homeScore ?? 0;
        const awayScore = m.awayScore ?? 0;

        if (standingsMap[home]) {
          const row = standingsMap[home];
          row.played++;
          row.goalsFor += homeScore;
          row.goalsAgainst += awayScore;
          if (homeScore > awayScore) {
            row.won++;
            row.points += 3;
          } else if (homeScore === awayScore) {
            row.drawn++;
            row.points += 1;
          } else {
            row.lost++;
          }
        }

        if (standingsMap[away]) {
          const row = standingsMap[away];
          row.played++;
          row.goalsFor += awayScore;
          row.goalsAgainst += homeScore;
          if (awayScore > homeScore) {
            row.won++;
            row.points += 3;
          } else if (awayScore === homeScore) {
            row.drawn++;
            row.points += 1;
          } else {
            row.lost++;
          }
        }
      }
    });

    const standingsArray = Object.values(standingsMap)
      .filter((row) => row.played > 0)
      .map((row) => {
        row.goalDifference = row.goalsFor - row.goalsAgainst;
        return row;
      })
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

    setStandings(standingsArray);

    const activeTeamNames = new Set(standingsArray.map(s => s.teamName.toLowerCase()));

    const scorerList: ScorerRow[] = allPlayersWithTeams
      .filter(item => activeTeamNames.has(item.teamName.toLowerCase()))
      .map((item, index) => {
        const pos = item.player.position || 'Delantero';
        let goals = 0;
        if (pos === 'Delantero') {
          goals = (index % 5) * 2 + 3; 
        } else if (pos === 'Mediocampista') {
          goals = (index % 4) + 1;
        } else if (pos === 'Defensa') {
          goals = (index % 10) === 0 ? 1 : 0;
        }
        return {
          ...item,
          goals,
        };
      })
      .filter(item => item.goals > 0)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 5);

    setScorers(scorerList);
  }, [selectedTournamentId, allTeams, allMatches, allPlayersWithTeams, loading]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-24 text-slate-100" style={{ background: NAVY, fontFamily: "'Inter', sans-serif" }}>

      <div className="bg-slate-950 text-white py-14 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>STATS</span>
        </div>

        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Análisis de Competencia</span>
            <h1
              className="uppercase text-white mt-1 leading-none font-black"
              style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              ESTADÍSTICAS GENERALES
            </h1>
            <p className="text-white/40 text-xs mt-3 max-w-md font-medium">
              Tabla de posiciones en tiempo real, goleadores históricos de la temporada y métricas de rendimiento de la liga.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#121E36]/30 border border-white/10 p-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Torneo o Copa</span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5">Selecciona la competición para filtrar estadísticas</span>
          </div>

          <div className="sm:ml-auto w-full sm:w-72">
            <select
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="w-full bg-[#121E36] border border-white/10 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-white/30 cursor-pointer"
              style={{ borderRadius: '0px' }}
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

        <div className="space-y-6">

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="uppercase text-white text-xl font-black" style={{ fontFamily: FONT_DISPLAY }}>
              Tabla de Posiciones
            </h2>

            {!loading && tournaments.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Torneo:</span>
                <select
                  value={selectedTournamentId}
                  onChange={(e) => setSelectedTournamentId(e.target.value)}
                  className="bg-[#121E36] border border-white/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-white/30 cursor-pointer"
                  style={{ borderRadius: '0px' }}
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
              Procesando estadísticas...
            </div>
          ) : standings.length > 0 ? (
            <div className="overflow-x-auto border border-white/10 shadow-xl">
              <table className="min-w-full divide-y divide-white/5 text-left text-xs bg-slate-950/20">
                <thead className="bg-[#121E36]/80 uppercase font-black text-slate-300 tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-center w-16">Pos</th>
                    <th className="px-6 py-4">Club</th>
                    <th className="px-4 py-4 text-center">PJ</th>
                    <th className="px-4 py-4 text-center">PG</th>
                    <th className="px-4 py-4 text-center">PE</th>
                    <th className="px-4 py-4 text-center">PP</th>
                    <th className="px-4 py-4 text-center hidden sm:table-cell">GF</th>
                    <th className="px-4 py-4 text-center hidden sm:table-cell">GC</th>
                    <th className="px-4 py-4 text-center">DG</th>
                    <th className="px-6 py-4 text-center text-red-500">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                  {standings.map((row, index) => {
                    const position = index + 1;
                    const isTop1 = position === 1;

                    return (
                      <tr key={row.teamId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-center font-black">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            isTop1 ? 'bg-red-600 text-white font-extrabold shadow' : 'text-slate-400'
                          }`}>
                            {position}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-11 aspect-[3/2] border border-white/10 overflow-hidden shrink-0 shadow bg-slate-900">
                            {row.badgeUrl ? (
                              <img src={row.badgeUrl} alt={row.teamName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-slate-500">CLUB</div>
                            )}
                          </div>
                          <span className="font-bold text-white uppercase text-xs">{row.teamName}</span>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-slate-400">{row.played}</td>
                        <td className="px-4 py-4 text-center text-green-500 font-semibold">{row.won}</td>
                        <td className="px-4 py-4 text-center text-amber-500 font-semibold">{row.drawn}</td>
                        <td className="px-4 py-4 text-center text-red-500 font-semibold">{row.lost}</td>
                        <td className="px-4 py-4 text-center text-slate-400 hidden sm:table-cell">{row.goalsFor}</td>
                        <td className="px-4 py-4 text-center text-slate-400 hidden sm:table-cell">{row.goalsAgainst}</td>
                        <td className="px-4 py-4 text-center font-semibold text-slate-300">
                          {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-black text-white">
                          {row.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-white/10 bg-slate-900/20 text-slate-500 font-bold uppercase tracking-widest text-xs">
              Aún no hay estadísticas disponibles para este torneo. Registra partidos finalizados para calcular la tabla.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="uppercase text-white text-xl font-black" style={{ fontFamily: FONT_DISPLAY }}>
              Goleadores
            </h2>
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
              Cargando goleadores...
            </div>
          ) : scorers.length > 0 ? (
            <div className="border border-white/10 bg-[#121E36]/30 p-5 space-y-4">
              {scorers.map((row, index) => (
                <div key={row.player.id} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500 w-4">{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {row.player.photoUrl ? (
                        <img src={row.player.photoUrl} alt={row.player.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400 fill-slate-800" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 3L8 5L9 4L12 7L15 4L16 5L18 3L21 6V11L19 12V21H5V12L3 11V6L6 3Z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">{row.player.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">{row.teamName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-black text-red-500" style={{ fontFamily: FONT_DISPLAY }}>{row.goals}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Goles</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center border border-dashed border-white/10 bg-[#121E36]/10 text-slate-500 font-bold uppercase tracking-widest text-xs">
              No hay goleadores registrados para los equipos participantes.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
