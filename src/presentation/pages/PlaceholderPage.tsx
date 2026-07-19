import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';

export function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
          <CardDescription>
            {description || 'Esta sección está en desarrollo y estará disponible pronto.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Estamos trabajando duro para traerte nuevas funcionalidades. Vuelve pronto para descubrir las novedades.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
