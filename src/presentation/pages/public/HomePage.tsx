import { Trophy, Shield, CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="space-y-12 pb-8">
      <section className="flex flex-col items-center text-center space-y-6 py-12 md:py-24">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          Versión Beta Disponible
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          La pasión del fútbol, <br className="hidden md:inline" />
          <span className="text-primary">organizada.</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Sigue a tus equipos favoritos, revisa los resultados de los partidos y mantente al día con los torneos más importantes.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link to="/torneos">
              Ver Torneos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/partidos">�altimos Partidos</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Trophy className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Torneos Activos</CardTitle>
            <CardDescription>
              Explora los torneos en curso, tablas de posiciones y estadísticas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/torneos">Explorar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Equipos Registrados</CardTitle>
            <CardDescription>
              Conoce a los equipos, sus jugadores y su rendimiento histórico.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/equipos">Ver Equipos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CalendarDays className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Calendario de Partidos</CardTitle>
            <CardDescription>
              No te pierdas ningún encuentro. Revisa resultados y próximos juegos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/partidos">Ir al calendario</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
