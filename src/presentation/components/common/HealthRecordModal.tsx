import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Loader2 } from 'lucide-react';
import { healthRepository } from '@/infrastructure/factories/dashboard.factory';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  activeTab: 'medical' | 'injuries' | 'performance' | 'diet';
  playerId: string;
}

export function HealthRecordModal({ isOpen, onClose, onSuccess, activeTab, playerId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [tipoSangre, setTipoSangre] = useState('');
  const [alergias, setAlergias] = useState('');
  const [medicamentos, setMedicamentos] = useState('');

  const [pesoKg, setPesoKg] = useState('');
  const [alturaCm, setAlturaCm] = useState('');

  const [zonaCuerpo, setZonaCuerpo] = useState('');
  const [tipoLesion, setTipoLesion] = useState('');
  const [gravedad, setGravedad] = useState('Leve');
  const [descripcion, setDescripcion] = useState('');

  const [velocidad30, setVelocidad30] = useState('');
  const [salto, setSalto] = useState('');

  const [calorias, setCalorias] = useState('');
  const [proteina, setProteina] = useState('');
  const [dietaDesc, setDietaDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'medical') {
        // Antecedentes
        await healthRepository.createHealthBackground({
          jugador: playerId,
          tipo_sangre: tipoSangre,
          alergias,
          medicamentos_regulares: medicamentos
        });
        
        if (pesoKg || alturaCm) {
          // Antropometria (often added at the same time in medical tab for convenience)
          await healthRepository.createAnthropometric({
            jugador: playerId,
            peso_kg: parseFloat(pesoKg) || 0,
            altura_cm: parseFloat(alturaCm) || 0,
            fecha_toma: new Date().toISOString().split('T')[0]
          });
        }
      } else if (activeTab === 'injuries') {
        await healthRepository.createInjury({
          jugador: playerId,
          zona_cuerpo: zonaCuerpo,
          tipo_lesion: tipoLesion,
          gravedad,
          descripcion,
          fecha_inicio: new Date().toISOString().split('T')[0],
          activa: true
        });
      } else if (activeTab === 'performance') {
        await healthRepository.createPerformanceTest({
          jugador: playerId,
          velocidad_30m_seg: parseFloat(velocidad30) || 0,
          salto_vertical_cm: parseFloat(salto) || 0,
          fecha_test: new Date().toISOString().split('T')[0]
        });
      } else if (activeTab === 'diet') {
        await healthRepository.createDietPlan({
          jugador: playerId,
          descripcion_dieta: dietaDesc,
          calorias_totales: parseInt(calorias) || 0,
          proteina_gr: parseFloat(proteina) || 0,
          fecha_inicio: new Date().toISOString().split('T')[0],
          activo: true
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving record', error);
      alert('Hubo un error al guardar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeTab === 'medical' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Antecedentes Clínicos</h3>
              <Input placeholder="Tipo de Sangre (ej. O+)" value={tipoSangre} onChange={e => setTipoSangre(e.target.value)} />
              <Input placeholder="Alergias" value={alergias} onChange={e => setAlergias(e.target.value)} />
              <Input placeholder="Medicamentos" value={medicamentos} onChange={e => setMedicamentos(e.target.value)} />
              
              <h3 className="font-semibold text-sm pt-2">Antropometría</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Peso (kg)" value={pesoKg} onChange={e => setPesoKg(e.target.value)} />
                <Input type="number" placeholder="Altura (cm)" value={alturaCm} onChange={e => setAlturaCm(e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'injuries' && (
            <div className="space-y-3">
              <Input placeholder="Zona del Cuerpo (ej. Rodilla)" value={zonaCuerpo} onChange={e => setZonaCuerpo(e.target.value)} required />
              <Input placeholder="Tipo de Lesión (ej. Esguince)" value={tipoLesion} onChange={e => setTipoLesion(e.target.value)} required />
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={gravedad} 
                onChange={e => setGravedad(e.target.value)}
              >
                <option value="Leve">Leve</option>
                <option value="Moderada">Moderada</option>
                <option value="Grave">Grave</option>
              </select>
              <Input placeholder="Descripción breve" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-3">
              <Input type="number" step="0.1" placeholder="Velocidad 30m (segundos)" value={velocidad30} onChange={e => setVelocidad30(e.target.value)} />
              <Input type="number" step="0.1" placeholder="Salto Vertical (cm)" value={salto} onChange={e => setSalto(e.target.value)} />
            </div>
          )}

          {activeTab === 'diet' && (
            <div className="space-y-3">
              <Input placeholder="Descripción de la Dieta" value={dietaDesc} onChange={e => setDietaDesc(e.target.value)} required />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Calorías Totales" value={calorias} onChange={e => setCalorias(e.target.value)} />
                <Input type="number" step="0.1" placeholder="Proteína (g)" value={proteina} onChange={e => setProteina(e.target.value)} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#f94116] hover:bg-[#d83610] text-white">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
