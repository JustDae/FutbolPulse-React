import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Shield } from 'lucide-react';

export function TeamCard({ team }: { team: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex items-center justify-center pb-2">
        {team?.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="w-16 h-16 object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="text-center">
        <h3 className="font-semibold truncate">{team?.name || 'Equipo Sin Nombre'}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {team?.city ? team.city : 'Ciudad desconocida'}
        </p>
      </CardContent>
    </Card>
  );
}
