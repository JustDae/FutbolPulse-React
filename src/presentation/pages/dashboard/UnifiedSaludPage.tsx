import { useState, useEffect } from 'react';
import { PremiumGate } from '../../components/PremiumGate';
import { Activity, Stethoscope, Dumbbell, Apple, Loader2, AlertCircle } from 'lucide-react';
import { AxiosPlayerRepository } from '../../../infrastructure/adapters/axios-player.repository';
import { healthRepository } from '../../../infrastructure/factories/dashboard.factory';
import type { Player } from '../../../domain/entities/player.entity';
import type { 
  HealthBackground, Anthropometric, Injury, 
  PerformanceTest, DietPlan 
} from '../../../domain/entities/health.entity';
import { useTeamStore } from '../../store/team.store';

const playerRepo = new AxiosPlayerRepository();

type Tab = 'medical' | 'injuries' | 'performance' | 'diet';

export const UnifiedSaludPage = () => {
  const { fetchTeams } = useTeamStore();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('medical');
  const [isLoading, setIsLoading] = useState(false);

  const [medical, setMedical] = useState<HealthBackground[]>([]);
  const [anthropometric, setAnthropometric] = useState<Anthropometric[]>([]);
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    const initData = async () => {
      try {
        const fetchedPlayers = await playerRepo.getPlayers();
        setPlayers(fetchedPlayers);
        if (fetchedPlayers.length > 0) setSelectedPlayerId(fetchedPlayers[0].id);
      } catch (error) {
        console.error('Error fetching players', error);
      }
    };
    initData();
  }, []);

  const fetchTabContent = async () => {
    if (!selectedPlayerId) return;
    setIsLoading(true);
    try {
      if (activeTab === 'medical') {
        const [m, a] = await Promise.all([
          healthRepository.getHealthBackground(selectedPlayerId),
          healthRepository.getAnthropometrics(selectedPlayerId)
        ]);
        setMedical(m);
        setAnthropometric(a);
      } else if (activeTab === 'injuries') {
        const i = await healthRepository.getInjuries(selectedPlayerId);
        setInjuries(i);
      } else if (activeTab === 'performance') {
        const t = await healthRepository.getPerformanceTests(selectedPlayerId);
        setTests(t);
      } else if (activeTab === 'diet') {
        const d = await healthRepository.getDietPlans(selectedPlayerId);
        setDiets(d);
      }
    } catch (error) {
      console.error('Error fetching tab data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabContent();
  }, [selectedPlayerId, activeTab]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#2D3748] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Salud y Rendimiento
            </h1>
          </div>
          <p className="text-[#A0AEC0] text-xs mt-1 font-medium pl-5">Gestión del perfil médico y físico de la plantilla.</p>
        </div>
      </div>

      <PremiumGate featureName="Control Médico y Rendimiento Avanzado">
        <div className="bg-[#121820] rounded-xl border border-[#2D3748] p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: 'medical', label: 'Perfil Médico', icon: Activity },
                { id: 'injuries', label: 'Lesiones', icon: Stethoscope },
                { id: 'performance', label: 'Rendimiento', icon: Dumbbell },
                { id: 'diet', label: 'Nutrición', icon: Apple },
              ].map(tab => (
                <button 
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    activeTab === tab.id 
                      ? 'bg-[#E63946] text-white shadow-md shadow-[#E63946]/20' 
                      : 'text-[#A0AEC0] hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab(tab.id as Tab)}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </div>

            <select 
              className="px-4 py-2 bg-[#0B1220] border border-[#2D3748] rounded-xl text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-[#E63946] transition-colors cursor-pointer"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
            >
              <option value="" disabled>Seleccionar Jugador...</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.firstNames} {p.lastNames}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#E63946]" />
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'medical' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-[#0A0E14] border border-[#2D3748] rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Antecedentes Clínicos</h3>
                    {medical.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-[#A0AEC0]">
                        <Stethoscope className="h-8 w-8 mb-3 opacity-50" />
                        <p className="text-xs font-bold uppercase tracking-wider">No hay antecedentes registrados</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {medical.map(m => (
                          <div key={m.id} className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                              <span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Tipo de Sangre</span>
                              <span className="text-white font-medium">{m.tipoSangre || '-'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Alergias</span>
                              <span className="text-white font-medium">{m.alergias || 'Ninguna'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Medicamentos</span>
                              <span className="text-white font-medium">{m.medicamentosRegulares || 'Ninguno'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Condiciones</span>
                              <span className="text-white font-medium">{m.condicionesCronicas || 'Ninguna'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0A0E14] border border-[#2D3748] rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Antropometría</h3>
                    {anthropometric.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-[#A0AEC0]">
                        <Activity className="h-8 w-8 mb-3 opacity-50" />
                        <p className="text-xs font-bold uppercase tracking-wider">Sin registros</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#121820] border border-[#2D3748] p-4 rounded-xl flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-white">{anthropometric[0].pesoKg} <span className="text-sm font-normal text-[#A0AEC0]">kg</span></div>
                            <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mt-1">Peso Actual</div>
                          </div>
                          <div className="bg-[#121820] border border-[#2D3748] p-4 rounded-xl flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-white">{anthropometric[0].imc}</div>
                            <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mt-1">IMC</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                          <div><span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Altura</span><span className="text-white font-medium">{anthropometric[0].alturaCm} cm</span></div>
                          <div><span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Grasa Corporal</span><span className="text-white font-medium">{anthropometric[0].grasaCorporal}%</span></div>
                          <div><span className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Masa Muscular</span><span className="text-white font-medium">{anthropometric[0].masaMuscular} kg</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'injuries' && (
                <div className="bg-[#0A0E14] border border-[#2D3748] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Historial de Lesiones</h3>
                  {injuries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#A0AEC0]">
                      <AlertCircle className="h-8 w-8 mb-3 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-wider">No se han registrado lesiones</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {injuries.map(injury => (
                        <div key={injury.id} className="flex flex-col md:flex-row md:items-start justify-between p-4 bg-[#121820] border border-[#2D3748] rounded-xl">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white text-base">{injury.zonaCuerpo}</h4>
                              <span className="text-[#A0AEC0] text-sm">— {injury.tipoLesion}</span>
                            </div>
                            <p className="text-sm text-[#A0AEC0] mb-3 leading-relaxed">{injury.descripcion}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#A0AEC0]">
                              <span><strong className="font-bold text-white">Desde:</strong> {injury.fechaInicio}</span>
                              {injury.fechaAlta && <span><strong className="font-bold text-white">Alta:</strong> {injury.fechaAlta}</span>}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex gap-2 shrink-0">
                            <span className="px-2.5 py-1 bg-[#2D3748] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                              {injury.gravedad}
                            </span>
                            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-lg font-bold ${injury.activa ? 'bg-[#E63946]/10 text-[#E63946]' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {injury.activa ? 'Activa' : 'Recuperado'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="bg-[#0A0E14] border border-[#2D3748] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Pruebas Físicas</h3>
                  {tests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#A0AEC0]">
                      <Dumbbell className="h-8 w-8 mb-3 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-wider">No hay pruebas registradas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tests.map(test => (
                        <div key={test.id} className="bg-[#121820] border border-[#2D3748] p-5 rounded-xl">
                          <div className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#E63946]" /> Test del {new Date(test.fechaTest).toLocaleDateString()}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-[#0A0E14] border border-[#2D3748] rounded-xl">
                              <span className="block text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Velocidad 30m</span>
                              <div className="font-bold text-lg text-white">{test.velocidad30mSeg} <span className="text-xs font-normal text-[#A0AEC0]">s</span></div>
                            </div>
                            <div className="p-4 bg-[#0A0E14] border border-[#2D3748] rounded-xl">
                              <span className="block text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Salto Vertical</span>
                              <div className="font-bold text-lg text-white">{test.saltoVerticalCm} <span className="text-xs font-normal text-[#A0AEC0]">cm</span></div>
                            </div>
                            <div className="p-4 bg-[#0A0E14] border border-[#2D3748] rounded-xl">
                              <span className="block text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">VO2 Max</span>
                              <div className="font-bold text-lg text-white">{test.resistenciaVo2max}</div>
                            </div>
                            <div className="p-4 bg-[#0A0E14] border border-[#2D3748] rounded-xl">
                              <span className="block text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Agilidad</span>
                              <div className="font-bold text-lg text-white">{test.agilidadSeg} <span className="text-xs font-normal text-[#A0AEC0]">s</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'diet' && (
                <div className="bg-[#0A0E14] border border-[#2D3748] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Plan Nutricional</h3>
                  {diets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#A0AEC0]">
                      <Apple className="h-8 w-8 mb-3 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-wider">Sin planes nutricionales</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {diets.map(diet => (
                        <div key={diet.id} className="bg-[#121820] border border-[#2D3748] p-5 rounded-xl">
                          <div className="flex justify-between items-start mb-5">
                            <div>
                              <h4 className="font-bold text-base text-white">{diet.descripcionDieta || 'Dieta Estándar'}</h4>
                              <div className="text-xs text-[#A0AEC0] mt-1 font-bold uppercase tracking-wider">
                                {diet.fechaInicio}
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${diet.activo ? 'bg-[#E63946]/10 text-[#E63946]' : 'bg-[#2D3748] text-[#A0AEC0]'}`}>
                              {diet.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="bg-[#0A0E14] p-3 rounded-xl border border-[#2D3748]">
                              <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Calorías</div>
                              <div className="font-bold text-lg text-white">{diet.caloriasTotales}</div>
                            </div>
                            <div className="bg-[#0A0E14] p-3 rounded-xl border border-[#2D3748]">
                              <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Proteína</div>
                              <div className="font-bold text-lg text-white">{diet.proteinaGr}g</div>
                            </div>
                            <div className="bg-[#0A0E14] p-3 rounded-xl border border-[#2D3748]">
                              <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Carbohidratos</div>
                              <div className="font-bold text-lg text-white">{diet.carbohidratosGr}g</div>
                            </div>
                            <div className="bg-[#0A0E14] p-3 rounded-xl border border-[#2D3748]">
                              <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Grasas</div>
                              <div className="font-bold text-lg text-white">{diet.grasasGr}g</div>
                            </div>
                            <div className="bg-[#0A0E14] p-3 rounded-xl border border-[#2D3748]">
                              <div className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Hidratación</div>
                              <div className="font-bold text-lg text-white">{diet.hidratacionMl} <span className="text-xs font-normal text-[#A0AEC0]">ml</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};
