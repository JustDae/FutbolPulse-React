import { SearchBar } from '@/presentation/components/SearchBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/card';
import { Star, TrendingUp, Activity } from 'lucide-react';

export function ScoutProspectsPage() {
  const prospects = [
    { id: 1, name: 'Endrick Felipe', position: 'Delantero', age: 17, potential: 95 },
    { id: 2, name: 'Lamine Yamal', position: 'Extremo', age: 16, potential: 96 },
    { id: 3, name: 'Warren Zaïre-Emery', position: 'Mediocentro', age: 18, potential: 92 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Mis Prospectos</h1>
      </div>
      <p className="text-muted-foreground">Monitorea a los jugadores jóvenes con mayor proyección.</p>

      <div className="max-w-md">
        <SearchBar placeholder="Buscar prospecto..." onSearch={(q) => console.log(q)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prospects.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {p.name}
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{p.potential} OVR</div>
              <p className="text-xs text-muted-foreground mt-1">
                {p.position} • {p.age} años
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +3 pts
                </div>
                <div className="flex items-center text-blue-500">
                  <Activity className="mr-1 h-3 w-3" />
                  Alta Actividad
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
