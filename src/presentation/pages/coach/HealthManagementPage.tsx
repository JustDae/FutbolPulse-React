import { useState, useEffect } from 'react';
import { Activity, Stethoscope, Dumbbell, Apple, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { healthRepository } from '@/infrastructure/factories/dashboard.factory';
import type { Player } from '@/domain/entities/player.entity';
import type { 
  HealthBackground, Anthropometric, Injury, 
  PerformanceTest, DietPlan 
} from '@/domain/entities/health.entity';

const playerRepo = new AxiosPlayerRepository();

type Tab = 'medical' | 'injuries' | 'performance' | 'diet';

export function HealthManagementPage() {
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
    const fetchPlayers = async () => {
      try {
        const fetchedPlayers = await playerRepo.getPlayers();
        setPlayers(fetchedPlayers);
        if (fetchedPlayers.length > 0) {
          setSelectedPlayerId(fetchedPlayers[0].id);
        }
      } catch (error) {
        console.error('Error fetching players', error);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (!selectedPlayerId) return;

    const fetchTabContent = async () => {
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

    fetchTabContent();
  }, [selectedPlayerId, activeTab]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Salud y Rendimiento</h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Jugador:</span>
          <select 
            className="flex h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
          >
            <option value="" disabled>Selecciona un jugador...</option>
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.firstNames} {p.lastNames}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 border-b pb-2 mb-4">
        <Button 
          variant={activeTab === 'medical' ? 'default' : 'ghost'} 
          className="rounded-full"
          onClick={() => setActiveTab('medical')}
        >
          <Activity className="mr-2 h-4 w-4" /> Perfil Médico
        </Button>
        <Button 
          variant={activeTab === 'injuries' ? 'default' : 'ghost'} 
          className="rounded-full"
          onClick={() => setActiveTab('injuries')}
        >
          <Stethoscope className="mr-2 h-4 w-4" /> Lesiones
        </Button>
        <Button 
          variant={activeTab === 'performance' ? 'default' : 'ghost'} 
          className="rounded-full"
          onClick={() => setActiveTab('performance')}
        >
          <Dumbbell className="mr-2 h-4 w-4" /> Rendimiento
        </Button>
        <Button 
          variant={activeTab === 'diet' ? 'default' : 'ghost'} 
          className="rounded-full"
          onClick={() => setActiveTab('diet')}
        >
          <Apple className="mr-2 h-4 w-4" /> Nutrición
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          
          {activeTab === 'medical' && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Antecedentes Clínicos</CardTitle>
                </CardHeader>
                <CardContent>
                  {medical.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay antecedentes registrados.</p>
                  ) : (
                    <div className="space-y-3">
                      {medical.map(m => (
                        <div key={m.id} className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-semibold">Tipo Sangre:</div><div>{m.tipoSangre || '-'}</div>
                          <div className="font-semibold">Alergias:</div><div>{m.alergias || 'Ninguna'}</div>
                          <div className="font-semibold">Medicamentos:</div><div>{m.medicamentosRegulares || 'Ninguno'}</div>
                          <div className="font-semibold">Condiciones:</div><div>{m.condicionesCronicas || 'Ninguna'}</div>
                          <div className="font-semibold">Contacto Médico:</div><div>{m.contactoMedicoNombre} ({m.contactoMedicoTel})</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Antropometría (�altimo Registro)</CardTitle>
                </CardHeader>
                <CardContent>
                  {anthropometric.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay registros antropométricos.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold">{anthropometric[0].pesoKg} kg</div>
                          <div className="text-xs text-muted-foreground uppercase font-semibold">Peso</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold">{anthropometric[0].imc}</div>
                          <div className="text-xs text-muted-foreground uppercase font-semibold">IMC</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-semibold">Altura:</div><div>{anthropometric[0].alturaCm} cm</div>
                        <div className="font-semibold">Grasa Corporal:</div><div>{anthropometric[0].grasaCorporal}%</div>
                        <div className="font-semibold">Masa Muscular:</div><div>{anthropometric[0].masaMuscular} kg</div>
                        <div className="font-semibold">Fecha de Toma:</div><div>{new Date(anthropometric[0].fechaToma).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'injuries' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de Lesiones</CardTitle>
                <CardDescription>Registro médico de lesiones y tratamientos en curso.</CardDescription>
              </CardHeader>
              <CardContent>
                {injuries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p>El jugador no tiene historial de lesiones.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {injuries.map(injury => (
                      <div key={injury.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-lg">{injury.zonaCuerpo} - {injury.tipoLesion}</h4>
                          <p className="text-sm text-muted-foreground">{injury.descripcion}</p>
                          <div className="text-xs text-muted-foreground mt-2 space-x-4">
                            <span>Desde: {injury.fechaInicio}</span>
                            {injury.fechaAlta && <span>Alta: {injury.fechaAlta}</span>}
                            <span>Médico: {injury.medicoTratante}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                            {injury.gravedad}
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${injury.activa ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tests Físicos</CardTitle>
              </CardHeader>
              <CardContent>
                {tests.length === 0 ? (
                   <p className="text-sm text-muted-foreground">No hay tests registrados.</p>
                ) : (
                  <div className="space-y-4">
                    {tests.map(test => (
                      <div key={test.id} className="border p-4 rounded-lg">
                        <div className="font-bold mb-4 border-b pb-2">Fecha: {new Date(test.fechaTest).toLocaleDateString()}</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><span className="text-muted-foreground block text-xs">Velocidad 30m</span>{test.velocidad30mSeg}s</div>
                          <div><span className="text-muted-foreground block text-xs">Salto Vertical</span>{test.saltoVerticalCm} cm</div>
                          <div><span className="text-muted-foreground block text-xs">VO2Max</span>{test.resistenciaVo2max}</div>
                          <div><span className="text-muted-foreground block text-xs">Agilidad</span>{test.agilidadSeg}s</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'diet' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                {diets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay planes nutricionales activos.</p>
                ) : (
                  <div className="space-y-4">
                    {diets.map(diet => (
                      <div key={diet.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-lg">{diet.descripcionDieta || 'Dieta Estándar'}</h4>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${diet.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {diet.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="bg-muted p-2 rounded text-center"><div className="font-bold">{diet.caloriasTotales}</div><div className="text-xs uppercase">Kcal</div></div>
                          <div className="bg-muted p-2 rounded text-center"><div className="font-bold">{diet.proteinaGr}g</div><div className="text-xs uppercase">Prot</div></div>
                          <div className="bg-muted p-2 rounded text-center"><div className="font-bold">{diet.carbohidratosGr}g</div><div className="text-xs uppercase">Carb</div></div>
                          <div className="bg-muted p-2 rounded text-center"><div className="font-bold">{diet.grasasGr}g</div><div className="text-xs uppercase">Grasa</div></div>
                          <div className="bg-muted p-2 rounded text-center"><div className="font-bold">{diet.hidratacionMl}</div><div className="text-xs uppercase">ml/día</div></div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Asignado por: {diet.nutricionista} | Desde: {diet.fechaInicio}
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
    </div>
  );
}
