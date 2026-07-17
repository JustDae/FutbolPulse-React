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
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2">
        <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Suscripciones</h1>
        <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Supervisa los planes de pago y membresías de los usuarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-none shadow-sm dark:shadow-none rounded-2xl p-5">
          <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-gray-500 dark:text-[#888888] flex items-center gap-2">
              <Activity className="h-4 w-4" /> Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {subscriptions.filter(s => s.estado === 'Activo').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-none shadow-sm dark:shadow-none rounded-2xl p-5">
          <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-gray-500 dark:text-[#888888] flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Planes Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {subscriptions.filter(s => s.plan === 'Premium').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-none bg-white dark:bg-[#1a1a1c] shadow-sm dark:shadow-none">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-white/5 text-xs font-medium text-gray-500 dark:text-[#888888]">
            <tr>
              <th className="px-6 py-4">ID Usuario</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Inicio</th>
              <th className="px-6 py-4">Vencimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center">
                   <div className="flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#f94116]" /></div>
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-[#888888]">
                  No hay suscripciones registradas.
                </td>
              </tr>
            ) : (
              subscriptions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{s.usuario_email || s.usuario_id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${s.plan === 'Premium' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-[#101010] dark:text-[#888888]'}`}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      s.estado === 'Activo' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' :
                      s.estado === 'Vencido' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500' :
                      s.estado === 'Cancelado' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500' :
                      'bg-gray-100 text-gray-600 dark:bg-[#101010] dark:text-[#888888]'
                    }`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-[#888888]">{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-[#888888]">{new Date(s.fecha_vencimiento).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
