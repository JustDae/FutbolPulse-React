import { useState } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { UserAvatar } from '@/presentation/components/UserAvatar';
import { Badge } from '@/presentation/components/ui/badge';
import { Settings, Shield, User, LogOut, Save, X, Camera } from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre_completo: user?.nombre_completo || '',
    email: user?.email || '',
    foto_perfil: user?.foto_perfil || '',
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const isCoach = user.tipo_usuario === 'Coach';

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, foto_perfil: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
          <p className="text-muted-foreground">Administra tu información y preferencias.</p>
        </div>
        <Button variant="outline" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Tus datos principales de usuario.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {!isEditing ? (
              <>
                <div className="flex items-center gap-4">
                  <UserAvatar user={user} size="lg" />
                  <div>
                    <h3 className="text-2xl font-semibold">{user.nombre_completo || user.username}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                      <Badge variant={isCoach ? 'default' : 'secondary'} className="capitalize">
                        {user.tipo_usuario}
                      </Badge>
                      {user.is_staff && (
                        <Badge variant="destructive">
                          <Shield className="mr-1 h-3 w-3" />
                          Staff
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button className="w-full sm:w-auto" variant="outline" onClick={() => setIsEditing(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <UserAvatar user={{ ...user, foto_perfil: editForm.foto_perfil, nombre_completo: editForm.nombre_completo }} size="lg" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={editForm.nombre_completo}
                    onChange={e => setEditForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 gap-2" onClick={handleSave}>
                    <Save className="h-4 w-4" /> Guardar
                  </Button>
                  <Button className="flex-1 gap-2" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" /> Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isCoach ? (
          <Card>
            <CardHeader>
              <CardTitle>Privilegios de Coach</CardTitle>
              <CardDescription>Resumen de tus herramientas.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Como Coach, tienes permisos para gestionar entidades, equipos, crear partidos, y administrar a tus jugadores.
              </p>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="secondary">
                  <Shield className="mr-2 h-4 w-4" /> Mis Entidades Administradas
                </Button>
                <Button className="w-full justify-start" variant="secondary">
                  <User className="mr-2 h-4 w-4" /> Gestión de Plantilla
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas del Jugador</CardTitle>
              <CardDescription>Tu rendimiento y salud deportiva.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Actualmente solo tienes permisos de lectura sobre el calendario de partidos y torneos. Tus estadísticas serán actualizadas por el equipo técnico.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-[#1a1a1c] bg-gray-50 dark:bg-[#151515] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-widest">Partidos Jugados</p>
                </div>
                <div className="border border-gray-200 dark:border-[#1a1a1c] bg-gray-50 dark:bg-[#151515] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-widest">Goles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
