import { useEffect, useState } from 'react';
import { subscriptionRepository } from '@/infrastructure/adapters/axios-subscription.repository';
import type { Subscription } from '@/domain/entities/subscription.entity';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/card';
import { Loader2, CreditCard, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const data = await subscriptionRepository.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      toast.error('Error al cargar suscripciones');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Suscripciones</h1>
        <p className="text-sm text-gray-500">Supervisa los planes de pago y membresías de los usuarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
              <Activity className="h-4 w-4" /> Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {subscriptions.filter(s => s.estado === 'Activo').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-100 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-600">
              <CreditCard className="h-4 w-4" /> Planes Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {subscriptions.filter(s => s.plan === 'Premium').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial y Estado</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID Usuario</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Plan</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Inicio</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vencimiento</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {subscriptions.map(s => (
                    <tr key={s.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{s.usuario_email || s.usuario_id}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.plan === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {s.plan}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          s.estado === 'Activo' ? 'bg-green-100 text-green-700' :
                          s.estado === 'Vencido' ? 'bg-red-100 text-red-700' :
                          s.estado === 'Cancelado' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {s.estado}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                      <td className="p-4 align-middle">{new Date(s.fecha_vencimiento).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {subscriptions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No hay suscripciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
