import { Badge } from '@/presentation/components/ui/badge';

export function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (s: string) => {
    switch (s.toUpperCase()) {
      case 'ONGOING':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'FINISHED':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  const labels: Record<string, string> = {
    SCHEDULED: 'Programado',
    ONGOING: 'En Juego',
    FINISHED: 'Finalizado',
    CANCELLED: 'Cancelado'
  };

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {labels[status.toUpperCase()] || status}
    </Badge>
  );
}
