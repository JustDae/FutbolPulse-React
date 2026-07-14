import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Skeleton } from '@/presentation/components/ui/skeleton';

export function TeamCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center justify-center pb-2">
        <Skeleton className="h-16 w-16 rounded-full" />
      </CardHeader>
      <CardContent className="text-center flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}
