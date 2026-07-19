import type { Team } from '../../domain/entities/team.entity';
export interface StandingRow {
  teamId: string;
  played: number; 
  won: number;    
  drawn: number; 
  lost: number;   
  goalsFor: number;
  goalsAgainst: number; 
  goalDifference: number; 
  points: number; 
}
interface StandingsTableProps {
  standings: StandingRow[];
  teams: Team[];
  isLoading?: boolean;
}
export const StandingsTable = ({ standings, teams, isLoading }: StandingsTableProps) => {
  const getTeam = (teamId: string) => {
    return teams.find((t) => t.id === teamId);
  };
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Calculando tabla de posiciones...</div>;
  }
  if (standings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-gray-500 dark:border-zinc-800">
        Aún no hay estadísticas disponibles para este torneo.
      </div>
    );
  }
  const sortedStandings = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDifference - a.goalDifference;
  });
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3.5 text-center w-12">Pos</th>
            <th className="px-4 py-3.5">Club</th>
            <th className="px-3 py-3.5 text-center">PJ</th>
            <th className="px-3 py-3.5 text-center">PG</th>
            <th className="px-3 py-3.5 text-center">PE</th>
            <th className="px-3 py-3.5 text-center">PP</th>
            <th className="px-3 py-3.5 text-center hidden sm:table-cell">GF</th>
            <th className="px-3 py-3.5 text-center hidden sm:table-cell">GC</th>
            <th className="px-3 py-3.5 text-center">DG</th>
            <th className="px-4 py-3.5 text-center font-extrabold text-blue-600 dark:text-blue-400">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {sortedStandings.map((row, index) => {
            const team = getTeam(row.teamId);
            const position = index + 1;
            const isTop3 = position <= 3;
            return (
              <tr 
                key={row.teamId} 
                className="transition-colors hover:bg-gray-50/80 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3.5 text-center font-bold">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isTop3 
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {position}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border bg-gray-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                      {team?.badgeUrl ? (
                        <img src={team.badgeUrl} alt={team.name} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-gray-400">
                          CLUB
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{team?.name || 'Equipo eliminado'}</div>
                      <div className="text-[11px] text-gray-500 hidden md:block">Estadio: {team?.stadium || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-center font-medium text-gray-700 dark:text-gray-300">{row.played}</td>
                <td className="px-3 py-3.5 text-center text-green-600 font-semibold dark:text-green-400">{row.won}</td>
                <td className="px-3 py-3.5 text-center text-amber-600 font-semibold dark:text-amber-400">{row.drawn}</td>
                <td className="px-3 py-3.5 text-center text-red-600 font-semibold dark:text-red-400">{row.lost}</td>
                <td className="px-3 py-3.5 text-center text-gray-600 hidden sm:table-cell dark:text-gray-400">{row.goalsFor}</td>
                <td className="px-3 py-3.5 text-center text-gray-600 hidden sm:table-cell dark:text-gray-400">{row.goalsAgainst}</td>
                <td className="px-3 py-3.5 text-center font-semibold text-gray-800 dark:text-gray-200">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="px-4 py-3.5 text-center text-base font-black text-blue-600 dark:text-blue-400">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};