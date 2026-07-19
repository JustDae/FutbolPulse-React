import { Card, CardContent } from '@/presentation/components/ui/card';
import { User } from 'lucide-react';

export function PlayerCard({ player }: { player: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] bg-muted relative flex items-center justify-center">
        {player?.imageUrl ? (
          <img src={player.imageUrl} alt={player.name} className="object-cover w-full h-full" />
        ) : (
          <User className="w-12 h-12 text-muted-foreground" />
        )}
        <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-bold">
          #{player?.number || '00'}
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-bold truncate">{player?.name || 'Jugador Desconocido'}</h3>
        <p className="text-sm text-muted-foreground">{player?.position || 'Posición'}</p>
      </CardContent>
    </Card>
  );
}
