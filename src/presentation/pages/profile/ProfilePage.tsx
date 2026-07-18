import { useState } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { usePlayerStore } from '@/presentation/store/player.store';
import { Settings, Shield, User, LogOut, Save, X, Camera } from 'lucide-react';
import { toast } from 'sonner';

const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

export function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const { currentPlayer } = usePlayerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre_completo: user?.nombre_completo || '',
    email:           user?.email           || '',
    foto_perfil:     user?.foto_perfil     || '',
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <p className="text-xs uppercase tracking-widest">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const isCoach  = user.tipo_usuario === 'Coach';
  const roleLabel = isCoach ? 'Coach' : user.tipo_usuario === 'Player' ? 'Jugador' : user.tipo_usuario || 'Usuario';

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setEditForm(prev => ({ ...prev, foto_perfil: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const displayName    = user.nombre_completo || user.username || 'Usuario';
  const initials       = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  const playerBadge    = 'Jugador Pro';
  const profilePhoto   = editForm.foto_perfil || currentPlayer?.photoUrl || user?.foto_perfil;

  return (
    <div className="flex-1 space-y-8 pb-10">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden p-8 md:p-10 border border-border"
        style={{ background: 'linear-gradient(105deg, rgba(227,28,61,0.1) 0%, var(--card) 60%)' }}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="relative z-10 pl-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-[2px] bg-primary" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Cuenta
              </span>
            </div>
            <h1
              className="uppercase text-foreground mb-2"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 'clamp(34px,5vw,56px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
            >
              Mi Perfil
            </h1>
            <p className="text-sm text-muted-foreground">
              Administra tu información y preferencias.
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-widest border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors bg-card"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Personal Info Card */}
        <div className="bg-card border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h2
                className="uppercase text-foreground"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '20px', letterSpacing: '-0.01em' }}
              >
                Información Personal
              </h2>
              <p className="text-[10px] mt-0.5 text-muted-foreground">Tus datos principales de usuario.</p>
            </div>
            <Settings className="w-4 h-4 text-muted-foreground/30" />
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Avatar + info */}
                <div className="flex items-center gap-5">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Perfil" className="w-16 h-16 object-cover rounded-full border-2 border-primary" />
                  ) : (
                    <div
                      className="w-16 h-16 flex items-center justify-center font-bold text-white text-xl shrink-0 bg-primary rounded-full"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-foreground text-lg" style={{ fontFamily: FONT_DISPLAY }}>
                      {displayName}
                    </p>
                    <p className="text-sm mt-0.5 text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary"
                      >
                        {roleLabel}
                      </span>
                      {user.tipo_usuario === 'Player' && (
                        <span
                          className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-muted border border-border text-muted-foreground"
                        >
                          {playerBadge}
                        </span>
                      )}
                      {user.is_staff && (
                        <span
                          className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
                        >
                          <Shield className="w-3 h-3" /> Staff
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border bg-muted/20 border-border text-muted-foreground hover:border-primary hover:text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Settings className="w-3.5 h-3.5" /> Editar Perfil
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Avatar upload */}
                <div className="flex justify-center mb-2">
                  <div className="relative group cursor-pointer">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Perfil" className="w-16 h-16 object-cover rounded-full border-2 border-primary" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center font-bold text-white text-xl bg-primary rounded-full" style={{ fontFamily: FONT_DISPLAY }}>
                        {initials}
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-5 w-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-2 text-muted-foreground">Nombre Completo</label>
                  <input
                    type="text"
                    className="w-full h-10 px-3 text-sm text-foreground bg-muted/30 border border-border focus:border-primary outline-none transition-all"
                    value={editForm.nombre_completo}
                    onChange={e => setEditForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-2 text-muted-foreground">Correo Electrónico</label>
                  <input
                    type="email"
                    className="w-full h-10 px-3 text-sm text-foreground bg-muted/30 border border-border focus:border-primary outline-none transition-all"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 bg-primary"
                    onClick={handleSave}
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors bg-card"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Role Info Card */}
        <div className="bg-card border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h2
              className="uppercase text-foreground"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '20px', letterSpacing: '-0.01em' }}
            >
              {isCoach ? 'Privilegios de Coach' : 'Estadísticas del Jugador'}
            </h2>
            <p className="text-[10px] mt-0.5 text-muted-foreground">
              {isCoach ? 'Resumen de tus herramientas.' : 'Tu rendimiento y salud deportiva.'}
            </p>
          </div>

          <div className="p-6">
            {isCoach ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Como Coach, tienes permisos para gestionar entidades, equipos, crear partidos y administrar a tus jugadores.
                </p>
                {[
                  { icon: Shield, label: 'Mis Entidades Administradas' },
                  { icon: User,   label: 'Gestión de Plantilla' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest border transition-colors bg-muted/10 border-border text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Actualmente solo tienes permisos de lectura sobre el calendario de partidos y torneos. Tus estadísticas serán actualizadas por el equipo técnico.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '0', label: 'Partidos Jugados' },
                    { value: '0', label: 'Goles' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center justify-center py-6 bg-muted/20 border border-border">
                      <span className="font-bold text-3xl text-foreground" style={{ fontFamily: FONT_DISPLAY }}>{value}</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] mt-1 text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
