import { useAuthStore } from '@/presentation/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus, Shield, Users, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/presentation/components/ui/badge';

const MOCK_TEAMS = [
  { id: 1, nombre: 'Club Atlético Central', ciudad: 'Madrid', estado: 'Activo', miembros: 24 },
  { id: 2, nombre: 'Deportivo Norte', ciudad: 'Barcelona', estado: 'Activo', miembros: 18 },
  { id: 3, nombre: 'Sporting Sur', ciudad: 'Sevilla', estado: 'Inactivo', miembros: 0 },
];

export function TeamsPage() {
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Equipos</h2>
          <p className="text-muted-foreground">Listado de entidades deportivas registradas.</p>
        </div>
        
        {isCoach && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Equipo
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_TEAMS.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Shield className="h-8 w-8 text-primary" />
                <Badge variant={team.estado === 'Activo' ? 'default' : 'secondary'}>
                  {team.estado}
                </Badge>
              </div>
              <CardTitle className="mt-4">{team.nombre}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {team.ciudad}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" /> {team.miembros} Jugadores registrados
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/equipos/${team.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
