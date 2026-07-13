import { useState } from 'react';
import { ClipboardList, Save, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';

export function PostMatchEvaluationPage() {
  const [evaluations] = useState([]);
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Evaluaciones Post-Partido</h2>
        <Button disabled>
          <Save className="mr-2 h-4 w-4" /> Guardar Todo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" /> Calificar Jugadores
          </CardTitle>
          <CardDescription>
            Evalúa el rendimiento de los jugadores. Puedes marcar si el feedback es visible para ellos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
              <UserCheck className="mx-auto h-12 w-12 mb-4 text-muted-foreground/40" />
              <p className="text-lg font-medium">Selecciona un partido para evaluar</p>
              <p className="text-sm mt-1">Busca el partido finalizado en la parte superior para cargar los jugadores.</p>
            </div>
          ) : (
            <div className="space-y-4">
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
