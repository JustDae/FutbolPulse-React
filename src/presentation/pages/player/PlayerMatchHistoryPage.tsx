import { Calendar, MapPin, Clock, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/presentation/utils/cn';

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
  { id: '1', opponent: 'Brasil', date: '10 Oct 2026', location: 'Estadio Nacional', isHome: true, result: 'W', score: '2 - 1', started: true, minutesPlayed: 90 },
  { id: '2', opponent: 'Uruguay', date: '05 Oct 2026', location: 'Estadio Centenario', isHome: false, result: 'D', score: '1 - 1', started: true, minutesPlayed: 85 },
  { id: '3', opponent: 'Colombia', date: '28 Sep 2026', location: 'Estadio Nacional', isHome: true, result: 'L', score: '0 - 2', started: false, minutesPlayed: 30 },
];

export function PlayerMatchHistoryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mis Partidos</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial Reciente</CardTitle>
          <CardDescription>Resumen de tus participaciones en los últimos encuentros.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DUMMY_HISTORY.map((match) => (
              <div key={match.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-4 w-full md:w-1/3 mb-4 md:mb-0">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full font-bold text-white",
                    match.result === 'W' ? 'bg-green-500' : match.result === 'L' ? 'bg-red-500' : match.result === 'D' ? 'bg-yellow-500' : 'bg-gray-300'
                  )}>
                    {match.result ?? '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{match.score} vs {match.opponent}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> {match.date}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {match.isHome ? 'Local' : 'Visitante'} - {match.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <Badge variant={match.started ? 'default' : 'secondary'}>
                    {match.started ? 'Titular' : 'Suplente'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{match.minutesPlayed} minutos jugados</span>
                  </div>
                  {!match.started && match.minutesPlayed === 0 && (
                     <div className="flex items-center gap-1 text-xs text-orange-500 mt-1">
                       <Info className="w-3 h-3" /> No ingresó
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
