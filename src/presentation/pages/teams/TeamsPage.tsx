import { useState, useEffect } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Button } from '@/presentation/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import type { Team } from '@/domain/entities/team.entity';

const teamRepository = new AxiosTeamRepository();

export function TeamsPage() {
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    teamRepository.getTeams().then(setTeams).catch(console.error);
  }, []);

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 -mt-6 bg-slate-50 min-h-[calc(100vh-4rem)] pb-12">
      {/* Header ESPN Style */}
      <div className="bg-slate-900 text-white py-12 px-6 md:px-12 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-sm">
            Directorio de <span className="text-blue-500">Equipos</span>
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Conoce las plantillas, estadísticas y sedes de cada club.</p>
        </div>
        
        {isCoach && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none uppercase tracking-widest text-xs font-bold px-6 py-6 skew-x-[-10deg] relative z-10">
            <span className="skew-x-[10deg] flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Registrar Equipo
            </span>
          </Button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
        {teams.map((team, index) => {
          const colors = [
            { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
            { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
            { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
            { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
          ];
          const color = colors[index % 4];

          return (
            <div key={team.id} className="bg-white rounded shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 border border-slate-100 group">
              <div className={`h-24 ${color.bg} border-b ${color.border} relative flex justify-center items-end pb-4`}>
                <div className={`absolute -bottom-8 w-16 h-16 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center font-black ${color.text} text-xl z-10`}>
                  {team.name.substring(0, 3).toUpperCase()}
                </div>
              </div>
              
              <div className="p-6 pt-12 flex-1 flex flex-col items-center text-center">
                <h3 className="text-slate-900 font-bold text-lg mb-1">{team.name}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-medium mb-4">
                  <MapPin className="h-3 w-3" />
                  <span>{team.stadium || 'Sede principal'}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 w-full flex justify-between items-center px-4">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</span>
                     <span className={`text-xs font-bold ${team.isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                       {team.isActive ? 'Activo' : 'Inactivo'}
                     </span>
                   </div>
                   <div className="flex flex-col text-right">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fundación</span>
                     <span className="text-xs font-bold text-slate-700">{team.foundedYear || 'N/A'}</span>
                   </div>
                </div>
                
                <Link to={`/equipos/${team.id}`} className="mt-6 flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-3 transition-colors">
                  Ver Plantilla <span className="ml-2 text-blue-500">&gt;</span>
                </Link>
              </div>
            </div>
          );
        })}
        
        {teams.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Aún no hay equipos registrados en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}
