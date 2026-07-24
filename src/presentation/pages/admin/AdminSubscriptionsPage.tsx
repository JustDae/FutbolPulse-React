import { useEffect, useState, useMemo } from 'react';
import { subscriptionRepository } from '@/infrastructure/adapters/axios-subscription.repository';
import type { Subscription } from '@/domain/entities/subscription.entity';
import { CreditCard, Loader2 } from 'lucide-react';
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

  const activeSubscriptionsCount = useMemo(
    () => subscriptions.filter(s => s.estado === 'Activo' || s.plan).length,
    [subscriptions]
  );
  const monthlyRevenue = useMemo(
    () => subscriptions.length * 29,
    [subscriptions]
  );

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Gestión de Suscripciones
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Controla los planes de membresía, facturación y cuentas activas de clubes.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#10182B] p-5 shadow-md">
          <div className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{subscriptions.length}</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Suscripciones Totales</div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#10182B] p-5 shadow-md">
          <div className="text-3xl font-black text-emerald-500 dark:text-emerald-400" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeSubscriptionsCount}</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Planes Activos</div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#10182B] p-5 shadow-md">
          <div className="text-3xl font-black text-[#E63946]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>${monthlyRevenue} USD</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Ingreso Estimado Mensual</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#10182B] shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-[#1C2B45] bg-slate-50 dark:bg-[#1C2B45]/40 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-white/60">
            <tr>
              <th className="px-6 py-4">Usuario / Club</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Fecha Inicio</th>
              <th className="px-6 py-4">Vencimiento</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1C2B45]/50 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Loader2 className="animate-spin h-8 w-8 text-[#E63946] mx-auto mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/50">Cargando suscripciones...</p>
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 dark:text-white/40 font-bold uppercase tracking-widest">
                  No hay suscripciones registradas
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-[#1C2B45]/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{sub.usuario_email || sub.usuario_id}</td>
                  <td className="px-6 py-4 font-bold text-[#E63946]">{sub.plan || 'Estándar'}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-white/70">{sub.fecha_inicio ? new Date(sub.fecha_inicio).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-white/70">{sub.fecha_vencimiento ? new Date(sub.fecha_vencimiento).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${sub.estado === 'Activo' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10'}`}>
                      {sub.estado || 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-2 text-slate-400 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer" title="Ver detalles">
                      <CreditCard className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
