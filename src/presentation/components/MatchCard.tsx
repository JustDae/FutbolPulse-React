import { Card, CardContent } from '@/presentation/components/ui/card';
import { StatusBadge } from './StatusBadge';

export function MatchCard({ match }: { match: any }) {
  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{new Date(match?.date || Date.now()).toLocaleDateString()}</span>
          <StatusBadge status={match?.status || 'SCHEDULED'} />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
            </div>
            <span className="font-semibold text-center">{match?.homeTeam || 'Local'}</span>
          </div>
          <div className="text-2xl font-bold px-4">
            {match?.score ? `${match.score.home} - ${match.score.away}` : 'vs'}
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
            </div>
            <span className="font-semibold text-center">{match?.awayTeam || 'Visitante'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
