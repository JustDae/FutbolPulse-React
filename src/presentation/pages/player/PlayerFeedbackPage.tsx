import { Star, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface FeedbackItem {
  id: string;
  matchId: string;
  opponent: string;
  date: string;
  rating: number; 
  comments: string;
  coachName: string;
}

const DUMMY_FEEDBACK: FeedbackItem[] = [
  { 
    id: '1', 
    matchId: '1', 
    opponent: 'Brasil', 
    date: '10 Oct 2026', 
    rating: 4.5, 
    comments: 'Excelente desempeño táctico en el segundo tiempo. Mantuviste bien la posición y fuiste clave en la recuperación del balón.', 
    coachName: 'DT. Scaloni' 
  },
  { 
    id: '2', 
    matchId: '2', 
    opponent: 'Uruguay', 
    date: '05 Oct 2026', 
    rating: 3.0, 
    comments: 'Faltó intensidad en los primeros minutos. Necesitamos trabajar más la presión alta en los entrenamientos de la semana.', 
    coachName: 'DT. Scaloni' 
  },
];

export function PlayerFeedbackPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Evaluaciones Técnicas</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.75 / 5.0</div>
            <p className="text-xs text-muted-foreground">Últimos 5 partidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+0.5</div>
            <p className="text-xs text-muted-foreground">Respecto al mes anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {DUMMY_FEEDBACK.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card text-muted-foreground">
            <AlertCircle className="w-8 h-8 mb-4 text-muted-foreground/50" />
            <p>No hay evaluaciones disponibles por el momento.</p>
            <p className="text-sm">El cuerpo técnico aún no ha liberado el feedback de tus últimos partidos.</p>
          </div>
        ) : (
          DUMMY_FEEDBACK.map((feedback) => (
            <Card key={feedback.id} className="overflow-hidden">
              <div className="bg-muted px-4 py-3 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">vs {feedback.opponent}</h3>
                  <p className="text-xs text-muted-foreground">{feedback.date}</p>
                </div>
                <div className="flex items-center gap-1 bg-background px-3 py-1 rounded-full border shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{feedback.rating.toFixed(1)}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <MessageSquare className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm italic text-foreground/90">"{feedback.comments}"</p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">- {feedback.coachName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
