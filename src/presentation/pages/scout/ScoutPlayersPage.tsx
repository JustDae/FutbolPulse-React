import { SearchBar } from '@/presentation/components/SearchBar';
import { PlayerCard } from '@/presentation/components/PlayerCard';

export function ScoutPlayersPage() {
  const players = [
    { id: 1, name: 'Lucas Paquetá', position: 'Mediocampista', number: 10 },
    { id: 2, name: 'Vinicius Jr', position: 'Extremo Izquierdo', number: 7 },
    { id: 3, name: 'Rodrygo', position: 'Extremo Derecho', number: 11 },
    { id: 4, name: 'Alisson', position: 'Portero', number: 1 },
    { id: 5, name: 'Marquinhos', position: 'Defensa Central', number: 4 },
    { id: 6, name: 'Casemiro', position: 'Pivote', number: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Directorio de Jugadores</h1>
      </div>
      <p className="text-muted-foreground">Explora nuestra base de datos de jugadores disponibles para scouting.</p>

      <div className="max-w-md">
        <SearchBar placeholder="Buscar jugador..." onChange={(q: string) => console.log(q)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {players.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}
