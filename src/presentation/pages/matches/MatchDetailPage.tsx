import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { ArrowLeft, Edit2, Clock } from 'lucide-react';
export function MatchDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';
  const match = {
    id,
    local: 'Club Atlético Central',
    visitante: 'Deportivo Norte',
    fecha: '2023-10-15T15:00:00Z',
    sede: 'Estadio Principal',
    estado: 'Programado',
    goles_local: 0,
    goles_visitante: 0,
    observaciones: 'Partido de la 5ta jornada.',
  };
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/partidos">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Detalles del Partido</h2>
            <p className="text-muted-foreground">{new Date(match.fecha).toLocaleString()}</p>
          </div>
        </div>
        {isCoach && (
          <Button variant="outline">
            <Edit2 className="mr-2 h-4 w-4" />
            Actualizar Resultado
          </Button>
        )}
      </div>
      <Card className="text-center py-8 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-primary/20" />
        <CardContent className="pt-6">
          <Badge className="mb-6">{match.estado}</Badge>
          <div className="flex justify-center items-center gap-4 sm:gap-12">
            <div className="flex-1 text-right">
              <h3 className="text-2xl font-bold sm:text-4xl">{match.local}</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-6xl font-black bg-muted px-4 py-2 rounded-xl">
                {match.estado === 'Finalizado' ? `${match.goles_local} - ${match.goles_visitante}` : 'VS'}
              </div>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold sm:text-4xl">{match.visitante}</h3>
            </div>
          </div>
          <p className="mt-8 text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" /> Jugándose en: {match.sede}
          </p>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alineaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
              <p>Alineaciones aún no confirmadas.</p>
              {isCoach && (
                <Button variant="link" className="mt-2">Definir Alineación</Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Evaluación / Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
              <p>Sin eventos registrados.</p>
              {isCoach && (
                <Button variant="link" className="mt-2">Registrar Eventos en Vivo</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
