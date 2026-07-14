import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';

export function MatchResultForm({ matchId, onSubmit }: { matchId?: string, onSubmit?: (data: any) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ matchId, homeScore: 0, awayScore: 0 }); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2 flex-1">
          <Label>Local</Label>
          <Input type="number" min="0" placeholder="0" />
        </div>
        <div className="pt-6 font-bold">-</div>
        <div className="space-y-2 flex-1">
          <Label>Visitante</Label>
          <Input type="number" min="0" placeholder="0" />
        </div>
      </div>
      <Button type="submit" className="w-full">Guardar Resultado</Button>
    </form>
  );
}
