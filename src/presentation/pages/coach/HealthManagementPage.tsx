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
    <div className="flex-1 space-y-8 p-6 md:p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase neon-text-glow mb-1">
            Salud y Rendimiento
          </h1>
          <p className="text-muted-foreground font-medium text-sm tracking-wide">
            GESTIÓN DEL PERFIL MÉDICO Y FÍSICO DE LA PLANTILLA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm font-semibold outline-none text-foreground shadow-inner focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer backdrop-blur-md"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
            >
              <option value="" disabled className="bg-zinc-900">Seleccionar Jugador...</option>
              {players.map(p => (
                <option key={p.id} value={p.id} className="bg-zinc-900">{p.firstNames} {p.lastNames}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
              ▼
            </div>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(249,65,22,0.3)] rounded-xl px-5 py-2.5 flex items-center gap-2 font-bold tracking-wide uppercase text-xs transition-all"
          >
            <Plus className="h-4 w-4" /> Añadir Registro
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
        {[
          { id: 'medical', label: 'Perfil Médico', icon: Activity },
          { id: 'injuries', label: 'Lesiones', icon: Stethoscope },
          { id: 'performance', label: 'Rendimiento', icon: Dumbbell },
          { id: 'diet', label: 'Nutrición', icon: Apple },
        ].map(tab => (
          <button 
            key={tab.id}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all border ${
              activeTab === tab.id 
                ? 'bg-primary/10 border-primary text-primary neon-glow' 
                : 'bg-black/20 border-white/5 text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
            onClick={() => setActiveTab(tab.id as Tab)}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">

          {activeTab === 'medical' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card border-white/10 bg-black/40 backdrop-blur-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-lg font-black uppercase tracking-wider text-primary flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Antecedentes Clínicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {medical.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-70">
                      <Stethoscope className="h-10 w-10 mb-3" />
                      <p className="text-sm font-semibold uppercase tracking-wider">No hay antecedentes</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medical.map(m => (
                        <div key={m.id} className="grid grid-cols-2 gap-4 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                          <div><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Tipo Sangre</span><span className="font-semibold text-foreground">{m.tipoSangre || '-'}</span></div>
                          <div><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Alergias</span><span className="font-semibold text-foreground">{m.alergias || 'Ninguna'}</span></div>
                          <div><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Medicamentos</span><span className="font-semibold text-foreground">{m.medicamentosRegulares || 'Ninguno'}</span></div>
                          <div><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Condiciones</span><span className="font-semibold text-foreground">{m.condicionesCronicas || 'Ninguna'}</span></div>
                          <div className="col-span-2 mt-2 pt-2 border-t border-white/5">
                            <span className="block text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Contacto Médico</span>
                            <span className="font-semibold text-foreground">{m.contactoMedicoNombre} <span className="text-muted-foreground">({m.contactoMedicoTel})</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 bg-black/40 backdrop-blur-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-lg font-black uppercase tracking-wider text-primary flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Antropometría
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {anthropometric.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-70">
                      <Activity className="h-10 w-10 mb-3" />
                      <p className="text-sm font-semibold uppercase tracking-wider">Sin Registros</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center neon-glow">
                          <div className="text-3xl font-black text-foreground">{anthropometric[0].pesoKg} <span className="text-sm text-primary">kg</span></div>
                          <div className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">Peso Actual</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                          <div className="text-3xl font-black text-foreground">{anthropometric[0].imc}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Índice Masa (IMC)</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5"><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Altura</span><span className="font-semibold">{anthropometric[0].alturaCm} cm</span></div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5"><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Grasa Corp.</span><span className="font-semibold">{anthropometric[0].grasaCorporal}%</span></div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5"><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Masa Musc.</span><span className="font-semibold">{anthropometric[0].masaMuscular} kg</span></div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5"><span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Fecha Toma</span><span className="font-semibold text-primary">{new Date(anthropometric[0].fechaToma).toLocaleDateString()}</span></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'injuries' && (
            <Card className="glass-card border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-black uppercase tracking-wider text-primary flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" /> Historial de Lesiones
                </CardTitle>
                <CardDescription className="text-muted-foreground/70 tracking-wide text-xs">REGISTRO MÉDICO DE LESIONES Y TRATAMIENTOS</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {injuries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-70 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <AlertCircle className="h-12 w-12 mb-3" />
                    <p className="text-sm font-semibold uppercase tracking-wider">Sin lesiones registradas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {injuries.map(injury => (
                      <div key={injury.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group relative overflow-hidden">
                        <div className={`absolute left-0 top-0 w-1 h-full ${injury.activa ? 'bg-red-500' : 'bg-green-500'}`} />
                        <div className="pl-4">
                          <h4 className="font-black text-lg text-foreground uppercase tracking-wide">{injury.zonaCuerpo} <span className="text-muted-foreground font-medium text-sm ml-2">| {injury.tipoLesion}</span></h4>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">{injury.descripcion}</p>
                          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-3 flex items-center gap-4">
                            <span className="flex items-center gap-1"><span className="text-primary">DESDE:</span> {injury.fechaInicio}</span>
                            {injury.fechaAlta && <span className="flex items-center gap-1"><span className="text-primary">ALTA:</span> {injury.fechaAlta}</span>}
                            <span className="flex items-center gap-1"><span className="text-primary">DR.</span> {injury.medicoTratante}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-3 pl-4 md:pl-0">
                          <span className="px-3 py-1 bg-white/10 border border-white/10 text-foreground text-[10px] uppercase tracking-widest rounded-full font-bold">
                            {injury.gravedad}
                          </span>
                          <span className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold border ${injury.activa ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>
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
            <Card className="glass-card border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-black uppercase tracking-wider text-primary flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" /> Pruebas Físicas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tests.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-70">
                     <Dumbbell className="h-10 w-10 mb-3" />
                     <p className="text-sm font-semibold uppercase tracking-wider">No hay pruebas registradas</p>
                   </div>
                ) : (
                  <div className="space-y-4">
                    {tests.map(test => (
                      <div key={test.id} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <div className="font-black text-sm uppercase tracking-widest text-primary mb-4 pb-2 border-b border-white/10">
                          Test Físico — {new Date(test.fechaTest).toLocaleDateString()}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                          <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Velocidad 30m</span>
                            <div className="font-black text-xl text-foreground">{test.velocidad30mSeg} <span className="text-xs text-primary">s</span></div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Salto Vertical</span>
                            <div className="font-black text-xl text-foreground">{test.saltoVerticalCm} <span className="text-xs text-primary">cm</span></div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">VO2 Max</span>
                            <div className="font-black text-xl text-foreground">{test.resistenciaVo2max}</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Agilidad</span>
                            <div className="font-black text-xl text-foreground">{test.agilidadSeg} <span className="text-xs text-primary">s</span></div>
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
            <Card className="glass-card border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-black uppercase tracking-wider text-primary flex items-center gap-2">
                  <Apple className="h-5 w-5" /> Plan Nutricional
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {diets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-70">
                    <Apple className="h-10 w-10 mb-3" />
                    <p className="text-sm font-semibold uppercase tracking-wider">Sin Plan Nutricional</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {diets.map(diet => (
                      <div key={diet.id} className="bg-white/5 border border-white/10 p-5 rounded-xl relative overflow-hidden">
                        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-bl-lg ${diet.activo ? 'bg-primary text-primary-foreground shadow-md' : 'bg-zinc-800 text-zinc-400'}`}>
                          {diet.activo ? 'Plan Activo' : 'Inactivo'}
                        </div>
                        <h4 className="font-black text-xl text-foreground uppercase tracking-wide mb-5 mt-2">{diet.descripcionDieta || 'Dieta Estándar'}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-2xl font-black text-foreground">{diet.caloriasTotales}</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-primary mt-1">Kcal</div>
                          </div>
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-xl font-bold text-foreground">{diet.proteinaGr}g</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Proteína</div>
                          </div>
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-xl font-bold text-foreground">{diet.carbohidratosGr}g</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Carbos</div>
                          </div>
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-xl font-bold text-foreground">{diet.grasasGr}g</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Grasas</div>
                          </div>
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-xl font-bold text-foreground">{diet.hidratacionMl}</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mt-1">ml/día</div>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex gap-4 pt-4 border-t border-white/5">
                          <span><span className="text-primary">NUTRICIONISTA:</span> {diet.nutricionista}</span>
                          <span><span className="text-primary">DESDE:</span> {diet.fechaInicio}</span>
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
