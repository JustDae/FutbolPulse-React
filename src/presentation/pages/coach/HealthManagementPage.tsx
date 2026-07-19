import { useState, useEffect } from 'react';
import { Activity, Stethoscope, Dumbbell, Apple, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import { HealthRecordModal } from '@/presentation/components/common/HealthRecordModal';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { healthRepository } from '@/infrastructure/factories/dashboard.factory';
import type { Player } from '@/domain/entities/player.entity';
import type { 
  HealthBackground, Anthropometric, Injury, 
  PerformanceTest, DietPlan 
} from '@/domain/entities/health.entity';

const playerRepo = new AxiosPlayerRepository();
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import { useAuthStore } from '@/presentation/store/auth.store';
import { matchesCoach } from '@/presentation/utils/name.utils';

const teamRepo = new AxiosTeamRepository();

type Tab = 'medical' | 'injuries' | 'performance' | 'diet';

export function HealthManagementPage() {
  const { user } = useAuthStore();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('medical');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [medical, setMedical] = useState<HealthBackground[]>([]);
  const [anthropometric, setAnthropometric] = useState<Anthropometric[]>([]);
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);

  useEffect(() => {
    const fetchPlayersAndFilter = async () => {
      try {
        const [fetchedPlayers, fetchedTeams] = await Promise.all([
          playerRepo.getPlayers(),
          teamRepo.getTeams()
        ]);

        const isAdmin = user?.tipo_usuario?.toLowerCase() === 'admin' || user?.is_staff;

        if (isAdmin) {
           setPlayers(fetchedPlayers);
           if (fetchedPlayers.length > 0) setSelectedPlayerId(fetchedPlayers[0].id);
        } else if (user?.nombre_completo) {
           const myTeams = fetchedTeams.filter(t => 
             matchesCoach(t.coach, user.nombre_completo)
           );
           const myTeamIds = new Set(myTeams.map(t => t.id));
           const filteredPlayers = fetchedPlayers.filter(p => myTeamIds.has(p.teamId));
           setPlayers(filteredPlayers);
           if (filteredPlayers.length > 0) setSelectedPlayerId(filteredPlayers[0].id);
        } else {
           setPlayers([]);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchPlayersAndFilter();
  }, [user]);

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
    <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              Salud y Rendimiento
            </h1>
            <p className="text-zinc-400 text-sm">
              Gestión del perfil médico y físico de la plantilla.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 outline-none hover:border-zinc-700 focus:border-primary transition-colors cursor-pointer"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                <option value="" disabled className="bg-zinc-900">Seleccionar Jugador...</option>
                {players.map(p => (
                  <option key={p.id} value={p.id} className="bg-zinc-900">{p.firstNames} {p.lastNames}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">
                ▼
              </div>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Añadir Registro
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-zinc-800/50 custom-scrollbar">
        {[
          { id: 'medical', label: 'Perfil Médico', icon: Activity },
          { id: 'injuries', label: 'Lesiones', icon: Stethoscope },
          { id: 'performance', label: 'Rendimiento', icon: Dumbbell },
          { id: 'diet', label: 'Nutrición', icon: Apple },
        ].map(tab => (
          <button 
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
            onClick={() => setActiveTab(tab.id as Tab)}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="space-y-6">

          {activeTab === 'medical' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-[#121214] border-zinc-800/80 shadow-sm">
                <CardHeader className="border-b border-zinc-800/50 pb-4">
                  <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                    Antecedentes Clínicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {medical.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                      <Stethoscope className="h-8 w-8 mb-3 opacity-50" />
                      <p className="text-sm">No hay antecedentes registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medical.map(m => (
                        <div key={m.id} className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                          <div>
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Tipo de Sangre</span>
                            <span className="text-zinc-100">{m.tipoSangre || '-'}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Alergias</span>
                            <span className="text-zinc-100">{m.alergias || 'Ninguna'}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Medicamentos</span>
                            <span className="text-zinc-100">{m.medicamentosRegulares || 'Ninguno'}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Condiciones</span>
                            <span className="text-zinc-100">{m.condicionesCronicas || 'Ninguna'}</span>
                          </div>
                          <div className="col-span-2 pt-4 border-t border-zinc-800/50">
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Contacto de Emergencia / Médico</span>
                            <span className="text-zinc-100">{m.contactoMedicoNombre} <span className="text-zinc-500 ml-1">({m.contactoMedicoTel})</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#121214] border-zinc-800/80 shadow-sm">
                <CardHeader className="border-b border-zinc-800/50 pb-4">
                  <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                    Antropometría
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {anthropometric.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                      <Activity className="h-8 w-8 mb-3 opacity-50" />
                      <p className="text-sm">Sin registros</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-lg flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold text-zinc-100">{anthropometric[0].pesoKg} <span className="text-sm font-normal text-zinc-500">kg</span></div>
                          <div className="text-xs font-medium text-zinc-500 mt-1">Peso Actual</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-lg flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold text-zinc-100">{anthropometric[0].imc}</div>
                          <div className="text-xs font-medium text-zinc-500 mt-1">IMC</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div><span className="block text-xs font-medium text-zinc-500 mb-1">Altura</span><span className="text-zinc-100">{anthropometric[0].alturaCm} cm</span></div>
                        <div><span className="block text-xs font-medium text-zinc-500 mb-1">Grasa Corporal</span><span className="text-zinc-100">{anthropometric[0].grasaCorporal}%</span></div>
                        <div><span className="block text-xs font-medium text-zinc-500 mb-1">Masa Muscular</span><span className="text-zinc-100">{anthropometric[0].masaMuscular} kg</span></div>
                        <div><span className="block text-xs font-medium text-zinc-500 mb-1">Fecha de Toma</span><span className="text-zinc-100">{new Date(anthropometric[0].fechaToma).toLocaleDateString()}</span></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'injuries' && (
            <Card className="bg-[#121214] border-zinc-800/80 shadow-sm">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-base font-semibold text-zinc-100">Historial de Lesiones</CardTitle>
                <CardDescription className="text-zinc-400 text-sm mt-1">Registro médico de lesiones y tratamientos</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {injuries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                    <AlertCircle className="h-8 w-8 mb-3 opacity-50" />
                    <p className="text-sm">No se han registrado lesiones</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {injuries.map(injury => (
                      <div key={injury.id} className="flex flex-col md:flex-row md:items-start justify-between p-4 bg-zinc-900 border border-zinc-800/50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-zinc-100 text-base">{injury.zonaCuerpo}</h4>
                            <span className="text-zinc-500 text-sm">— {injury.tipoLesion}</span>
                          </div>
                          <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{injury.descripcion}</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
                            <span><strong className="font-medium text-zinc-400">Desde:</strong> {injury.fechaInicio}</span>
                            {injury.fechaAlta && <span><strong className="font-medium text-zinc-400">Alta:</strong> {injury.fechaAlta}</span>}
                            <span><strong className="font-medium text-zinc-400">Médico:</strong> {injury.medicoTratante}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2 shrink-0">
                          <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs rounded font-medium">
                            {injury.gravedad}
                          </span>
                          <span className={`px-2.5 py-1 text-xs rounded font-medium ${injury.activa ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                            {injury.activa ? 'Activa' : 'Recuperado'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'performance' && (
            <Card className="bg-[#121214] border-zinc-800/80 shadow-sm">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-base font-semibold text-zinc-100">Pruebas Físicas</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tests.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                     <Dumbbell className="h-8 w-8 mb-3 opacity-50" />
                     <p className="text-sm">No hay pruebas registradas</p>
                   </div>
                ) : (
                  <div className="space-y-4">
                    {tests.map(test => (
                      <div key={test.id} className="bg-zinc-900 border border-zinc-800/50 p-5 rounded-lg">
                        <div className="font-medium text-sm text-zinc-100 mb-4 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-zinc-500" /> Test del {new Date(test.fechaTest).toLocaleDateString()}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 border border-zinc-800/30 bg-[#161618] rounded-md">
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Velocidad 30m</span>
                            <div className="font-semibold text-lg text-zinc-100">{test.velocidad30mSeg} <span className="text-xs font-normal text-zinc-500">s</span></div>
                          </div>
                          <div className="p-3 border border-zinc-800/30 bg-[#161618] rounded-md">
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Salto Vertical</span>
                            <div className="font-semibold text-lg text-zinc-100">{test.saltoVerticalCm} <span className="text-xs font-normal text-zinc-500">cm</span></div>
                          </div>
                          <div className="p-3 border border-zinc-800/30 bg-[#161618] rounded-md">
                            <span className="block text-xs font-medium text-zinc-500 mb-1">VO2 Max</span>
                            <div className="font-semibold text-lg text-zinc-100">{test.resistenciaVo2max}</div>
                          </div>
                          <div className="p-3 border border-zinc-800/30 bg-[#161618] rounded-md">
                            <span className="block text-xs font-medium text-zinc-500 mb-1">Agilidad</span>
                            <div className="font-semibold text-lg text-zinc-100">{test.agilidadSeg} <span className="text-xs font-normal text-zinc-500">s</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'diet' && (
            <Card className="bg-[#121214] border-zinc-800/80 shadow-sm">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-base font-semibold text-zinc-100">Plan Nutricional</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {diets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                    <Apple className="h-8 w-8 mb-3 opacity-50" />
                    <p className="text-sm">Sin planes nutricionales</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {diets.map(diet => (
                      <div key={diet.id} className="bg-zinc-900 border border-zinc-800/50 p-5 rounded-lg">
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <h4 className="font-semibold text-base text-zinc-100">{diet.descripcionDieta || 'Dieta Estándar'}</h4>
                            <div className="text-sm text-zinc-400 mt-1">
                              Asignado por {diet.nutricionista} • {diet.fechaInicio}
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 text-xs rounded font-medium ${diet.activo ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                            {diet.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div className="bg-[#161618] p-3 rounded-md border border-zinc-800/30">
                            <div className="text-xs font-medium text-zinc-500 mb-1">Calorías</div>
                            <div className="font-semibold text-lg text-zinc-100">{diet.caloriasTotales}</div>
                          </div>
                          <div className="bg-[#161618] p-3 rounded-md border border-zinc-800/30">
                            <div className="text-xs font-medium text-zinc-500 mb-1">Proteína</div>
                            <div className="font-semibold text-lg text-zinc-100">{diet.proteinaGr}g</div>
                          </div>
                          <div className="bg-[#161618] p-3 rounded-md border border-zinc-800/30">
                            <div className="text-xs font-medium text-zinc-500 mb-1">Carbohidratos</div>
                            <div className="font-semibold text-lg text-zinc-100">{diet.carbohidratosGr}g</div>
                          </div>
                          <div className="bg-[#161618] p-3 rounded-md border border-zinc-800/30">
                            <div className="text-xs font-medium text-zinc-500 mb-1">Grasas</div>
                            <div className="font-semibold text-lg text-zinc-100">{diet.grasasGr}g</div>
                          </div>
                          <div className="bg-[#161618] p-3 rounded-md border border-zinc-800/30">
                            <div className="text-xs font-medium text-zinc-500 mb-1">Hidratación</div>
                            <div className="font-semibold text-lg text-zinc-100">{diet.hidratacionMl} <span className="text-xs font-normal text-zinc-500">ml</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      )}

      {selectedPlayerId && (
        <HealthRecordModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchTabContent} 
          activeTab={activeTab} 
          playerId={selectedPlayerId} 
        />
      )}
    </div>
  );
}
