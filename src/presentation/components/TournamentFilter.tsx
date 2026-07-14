import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';

export function TournamentFilter({ onFilterChange }: { onFilterChange?: (val: string) => void }) {
  return (
    <Select onValueChange={onFilterChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar torneos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="active">Activos</SelectItem>
        <SelectItem value="upcoming">Próximos</SelectItem>
        <SelectItem value="finished">Finalizados</SelectItem>
      </SelectContent>
    </Select>
  );
}
