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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/equipos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{teamDetails.nombre_entidad}</h2>
          <p className="text-muted-foreground">Detalles de la entidad deportiva.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre Oficial</p>
                  <p className="text-lg font-semibold">{teamDetails.nombre_entidad}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ciudad</p>
                    <p className="font-medium">{teamDetails.ciudad}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{teamDetails.telefono_contacto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                    <p className="font-medium">{teamDetails.email_contacto}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Jugadores de la Plantilla</CardTitle>
              <CardDescription>Lista de miembros vinculados a esta entidad.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No hay jugadores registrados en esta vista aún.</p>
                {isCoach && (
                  <Button variant="link" className="mt-2">Agregar Jugadores</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={teamDetails.estado === 'Activo' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                {teamDetails.estado}
              </Badge>
              <p className="text-xs text-muted-foreground mt-4">
                Registrado desde: {new Date(teamDetails.creado_en).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {isCoach && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Acciones de Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar Entidad
                </Button>
                <Button className="w-full justify-start text-destructive hover:bg-destructive/10" variant="ghost">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Entidad
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
