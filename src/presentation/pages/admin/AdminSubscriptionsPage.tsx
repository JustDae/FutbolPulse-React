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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Suscripciones</h1>
        <p className="text-sm text-zinc-500 mt-1">Supervisa los planes de pago y membresías de los usuarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-gradient-to-br from-red-500/5 to-white dark:from-red-950/10 dark:to-zinc-950 border-red-500/10 dark:border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-red-600 dark:text-red-400">
              <Activity className="h-4 w-4" /> Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-650 dark:text-red-400">
              {subscriptions.filter(s => s.estado === 'Activo').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-zinc-500/5 to-white dark:from-zinc-900/10 dark:to-zinc-950 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CreditCard className="h-4 w-4" /> Planes Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">
              {subscriptions.filter(s => s.plan === 'Premium').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 bg-card">
        <CardHeader>
          <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Historial y Estado</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-red-600" /></div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-850">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <tr>
                      <th className="px-5 py-3.5">ID Usuario</th>
                      <th className="px-5 py-3.5">Plan</th>
                      <th className="px-5 py-3.5">Estado</th>
                      <th className="px-5 py-3.5">Inicio</th>
                      <th className="px-5 py-3.5">Vencimiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {subscriptions.map(s => (
                      <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-white">{s.usuario_email || s.usuario_id}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            s.plan === 'Premium' 
                              ? 'bg-red-500/10 text-red-600 dark:bg-red-500/25 dark:text-red-400 border border-red-500/25' 
                              : 'bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400'
                          }`}>
                            {s.plan}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            s.estado === 'Activo' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            s.estado === 'Vencido' ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-450' :
                            s.estado === 'Cancelado' ? 'bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400' :
                            'bg-zinc-100 text-zinc-650'
                          }`}>
                            {s.estado}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{new Date(s.fecha_vencimiento).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {subscriptions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-5 text-center text-zinc-400">
                          No hay suscripciones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
