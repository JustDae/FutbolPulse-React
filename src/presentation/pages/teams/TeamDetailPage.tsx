import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Shield, MapPin, Phone, Mail, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';

export function TeamDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';

  const teamDetails = {
    id,
    nombre_entidad: 'Club Atlético Central',
    ciudad: 'Madrid',
    telefono_contacto: '+34 600 000 000',
    email_contacto: 'contacto@cac.es',
    estado: 'Activo',
    creado_en: '2023-01-15',
  };

  return (
    <div className="min-h-full bg-slate-50/50 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 px-6 py-16 sm:px-12 sm:py-24 rounded-b-[2.5rem] shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 transform">
            <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-[80px]" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8">
          <Button variant="ghost" className="w-fit text-slate-300 hover:text-white hover:bg-white/10 group -ml-4" asChild>
            <Link to="/equipos">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Volver al listado
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                Equipo Profesional
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                {teamDetails.nombre_entidad}
              </h2>
              <p className="text-lg text-slate-400 max-w-xl font-medium">
                Gestiona y analiza el rendimiento de la entidad deportiva al máximo nivel.
              </p>
            </div>
            {isCoach && (
              <div className="flex gap-3">
                <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all hover:scale-105">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* General Info Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-xl group hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500">
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-md hover:border-blue-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Nombre Oficial</p>
                  <p className="text-xl font-black text-slate-800">{teamDetails.nombre_entidad}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group/item flex items-start gap-4 p-3 -m-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Sede</p>
                    <p className="font-semibold text-slate-700">{teamDetails.ciudad}</p>
                  </div>
                </div>
                <div className="group/item flex items-start gap-4 p-3 -m-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contacto</p>
                    <p className="font-semibold text-slate-700">{teamDetails.telefono_contacto}</p>
                  </div>
                </div>
                <div className="group/item flex items-start gap-4 sm:col-span-2 p-3 -m-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</p>
                    <p className="font-semibold text-slate-700">{teamDetails.email_contacto}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Roster Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Plantilla</CardTitle>
                <CardDescription className="text-slate-500 font-medium mt-1">Jugadores vinculados al equipo</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-full shadow-sm">
                0 Jugadores
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="group/empty relative flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity rounded-2xl" />
                <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400 group-hover/empty:bg-blue-100 group-hover/empty:text-blue-500 transition-all duration-500 group-hover/empty:scale-110">
                  <Shield className="h-8 w-8" />
                </div>
                <p className="text-lg font-bold text-slate-700 mb-1">No hay jugadores</p>
                <p className="text-sm text-slate-500 max-w-[250px]">Aún no se han registrado miembros en la plantilla de este equipo.</p>
                {isCoach && (
                  <Button className="mt-6 bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 rounded-full px-8 font-bold">
                    Añadir Jugador
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Estado Operativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center p-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="relative mb-5">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                    <span className="h-8 w-8 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-sm" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{teamDetails.estado}</p>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Operaciones normales</p>
                
                <div className="w-full mt-8 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Registrado el</p>
                  <p className="font-bold text-slate-700">
                    {new Date(teamDetails.creado_en).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
