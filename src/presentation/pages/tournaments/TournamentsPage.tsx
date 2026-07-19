import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Trophy, CalendarRange, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_TOURNAMENTS = [
  { id: 1, nombre: 'Liga Metropolitana de Verano', estado: 'En Curso', equipos: 16, inicio: '2023-06-01' },
  { id: 2, nombre: 'Copa Nacional Juvenil', estado: 'Próximamente', equipos: 32, inicio: '2023-11-20' },
  { id: 3, nombre: 'Torneo Relámpago Ciudad del Sol', estado: 'Finalizado', equipos: 8, inicio: '2023-01-10' },
];

export function TournamentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Torneos</h2>
          <p className="text-muted-foreground">Explora las competiciones activas e históricas.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_TOURNAMENTS.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <Badge variant={t.estado === 'En Curso' ? 'default' : t.estado === 'Próximamente' ? 'secondary' : 'outline'}>
                  {t.estado}
                </Badge>
              </div>
              <CardTitle className="leading-tight">{t.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" /> {t.equipos} Equipos Participantes
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarRange className="mr-2 h-4 w-4" /> Inicio: {new Date(t.inicio).toLocaleDateString()}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link to={`/torneos/${t.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> Ver Tablas y Fixture
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
