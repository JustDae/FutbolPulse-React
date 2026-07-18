import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft, Trophy, CalendarDays, Medal } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';

export function TournamentDetailPage() {
  const { id } = useParams();

  const t = { 
    id, 
    nombre: 'Liga Metropolitana de Verano', 
    estado: 'En Curso', 
    equipos: 16, 
    inicio: '2023-06-01',
    descripcion: 'El torneo más prestigioso de la región metropolitana, reuniendo a los mejores talentos de las categorías juveniles.'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/torneos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.nombre}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{t.estado}</Badge>
            <span className="text-muted-foreground text-sm">| {t.equipos} Equipos</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Acerca del Torneo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t.descripcion}</p>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="font-medium">Fecha de Inicio:</span> {new Date(t.inicio).toLocaleDateString()}
            </div>

            <div className="mt-8 border-t pt-6">
              <h4 className="font-semibold mb-4 text-lg">Tabla de Posiciones (Demostración)</h4>
              <div className="rounded-md border">
                <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30">
                  <Medal className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  La tabla de posiciones se actualizará al finalizar la jornada.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sedes</CardTitle>
              <CardDescription>Donde se juega la magia</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Estadio Principal
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Canchas Auxiliares Norte
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">¿Quieres inscribir tu equipo?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ponte en contacto con los administradores para más detalles.
              </p>
              <Button className="w-full">Contacto de Soporte</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
