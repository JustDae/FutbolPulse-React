import { useAuthStore } from '@/presentation/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { CalendarPlus, CalendarDays, Clock, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_MATCHES = [
  { 
    id: 1, 
    local: 'Club Atlético Central', 
    visitante: 'Deportivo Norte', 
    fecha: '2023-10-15T15:00:00Z', 
    sede: 'Estadio Principal', 
    estado: 'Programado',
    goles_local: null,
    goles_visitante: null,
  },
  { 
    id: 2, 
    local: 'Sporting Sur', 
    visitante: 'Club Atlético Central', 
    fecha: '2023-10-08T18:30:00Z', 
    sede: 'Campo Auxiliar 2', 
    estado: 'Finalizado',
    goles_local: 1,
    goles_visitante: 3,
  },
];

export function MatchesPage() {
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendario de Partidos</h2>
          <p className="text-muted-foreground">Revisa los encuentros programados y resultados.</p>
        </div>
        
        {isCoach && (
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Programar Partido
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_MATCHES.map((match) => (
          <Card key={match.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${match.estado === 'Finalizado' ? 'bg-muted' : 'bg-primary'}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant={match.estado === 'Finalizado' ? 'secondary' : 'default'} className="mb-2">
                  {match.estado}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {new Date(match.fecha).toLocaleDateString()}
                  <Clock className="h-3 w-3 ml-2 mr-1" />
                  {new Date(match.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <CardTitle className="text-xl flex justify-between items-center mt-2">
                <span className="truncate flex-1 text-right">{match.local}</span>
                <span className="mx-4 text-muted-foreground text-sm font-normal">vs</span>
                <span className="truncate flex-1 text-left">{match.visitante}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {match.estado === 'Finalizado' ? (
                <div className="flex justify-center items-center gap-6 py-2 text-3xl font-black">
                  <span>{match.goles_local}</span>
                  <span className="text-muted-foreground font-normal text-lg">-</span>
                  <span>{match.goles_visitante}</span>
                </div>
              ) : (
                <div className="flex justify-center items-center py-4">
                  <span className="text-muted-foreground font-medium">Aún no se juega</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground justify-center mt-2">
                <MapPin className="h-3 w-3" /> {match.sede}
              </div>

              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to={`/partidos/${match.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> Ver Detalles del Partido
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
