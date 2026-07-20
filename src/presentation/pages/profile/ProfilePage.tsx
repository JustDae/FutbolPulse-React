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
    <div className="flex-1 space-y-8 pb-10 text-slate-900 dark:text-white animate-fade-in">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden p-8 md:p-10 border border-slate-200 dark:border-[#1C2B45] rounded-2xl bg-white dark:bg-[#10182B] shadow-lg"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E31C3D]" />
        <div className="relative z-10 pl-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-[2px] bg-[#E31C3D]" />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#E31C3D]">
                Mi Cuenta
              </span>
            </div>
            <h1
              className="uppercase text-slate-900 dark:text-white mb-2"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(34px,5vw,56px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
            >
              Mi Perfil
            </h1>
            <p className="text-xs text-slate-500 dark:text-white/50 font-medium">
              Administra tu información personal, credenciales y preferencias.
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest border border-slate-200 dark:border-[#1C2B45] text-slate-700 dark:text-white/70 hover:border-[#E31C3D] hover:text-[#E31C3D] dark:hover:border-[#E31C3D] dark:hover:text-[#E31C3D] transition-all rounded-xl bg-slate-50 dark:bg-[#0B1220]"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Personal Info Card */}
        <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1C2B45] flex items-center justify-between bg-slate-50/50 dark:bg-[#1C2B45]/30">
            <div>
              <h2
                className="uppercase text-slate-900 dark:text-white font-extrabold"
                style={{ fontFamily: FONT_DISPLAY, fontSize: '22px', letterSpacing: '-0.01em' }}
              >
                Información Personal
              </h2>
              <p className="text-[10px] mt-0.5 text-slate-500 dark:text-white/40 uppercase tracking-wider">Tus datos principales de usuario.</p>
            </div>
            <Settings className="w-4 h-4 text-[#E31C3D]" />
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Avatar + info */}
                <div className="flex items-center gap-5">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Perfil" className="w-16 h-16 object-cover rounded-2xl border-2 border-[#E31C3D] shadow-md" />
                  ) : (
                    <div
                      className="w-16 h-16 flex items-center justify-center font-black text-white text-xl shrink-0 bg-[#E31C3D] rounded-2xl shadow-md"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xl" style={{ fontFamily: FONT_DISPLAY }}>
                      {displayName}
                    </p>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-white/50">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-[#E31C3D]/10 border border-[#E31C3D]/30 text-[#E31C3D] rounded-lg"
                      >
                        {roleLabel}
                      </span>
                      {user.tipo_usuario === 'Player' && (
                        <span
                          className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/60 rounded-lg"
                        >
                          {playerBadge}
                        </span>
                      )}
                      {user.is_staff && (
                        <span
                          className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-500 rounded-lg"
                        >
                          <Shield className="w-3 h-3" /> Staff
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-extrabold uppercase tracking-widest transition-all border bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-[#0B1220] dark:hover:bg-[#1C2B45] border-slate-200 dark:border-[#1C2B45] dark:text-white rounded-xl"
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
                      <img src={profilePhoto} alt="Perfil" className="w-16 h-16 object-cover rounded-2xl border-2 border-[#E31C3D]" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center font-black text-white text-xl bg-[#E31C3D] rounded-2xl" style={{ fontFamily: FONT_DISPLAY }}>
                        {initials}
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-5 w-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-[0.15em] mb-2 text-slate-500 dark:text-white/50">Nombre Completo</label>
                  <input
                    type="text"
                    className="w-full h-10 px-3 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] focus:border-[#E31C3D] outline-none transition-all rounded-xl"
                    value={editForm.nombre_completo}
                    onChange={e => setEditForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-[0.15em] mb-2 text-slate-500 dark:text-white/50">Correo Electrónico</label>
                  <input
                    type="email"
                    className="w-full h-10 px-3 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] focus:border-[#E31C3D] outline-none transition-all rounded-xl"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-extrabold uppercase tracking-widest text-white transition-opacity hover:opacity-90 bg-[#E31C3D] rounded-xl shadow-md"
                    onClick={handleSave}
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-extrabold uppercase tracking-widest border border-slate-200 dark:border-[#1C2B45] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-[#0B1220] transition-colors rounded-xl"
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
        <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1C2B45] bg-slate-50/50 dark:bg-[#1C2B45]/30">
            <h2
              className="uppercase text-slate-900 dark:text-white font-extrabold"
              style={{ fontFamily: FONT_DISPLAY, fontSize: '22px', letterSpacing: '-0.01em' }}
            >
              {isCoach ? 'Privilegios de Coach' : 'Estadísticas del Jugador'}
            </h2>
            <p className="text-[10px] mt-0.5 text-slate-500 dark:text-white/40 uppercase tracking-wider">
              {isCoach ? 'Resumen de tus herramientas.' : 'Tu rendimiento y salud deportiva.'}
            </p>
          </div>

          <div className="p-6">
            {isCoach ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-white/50 mb-3 leading-relaxed">
                  Como Coach, tienes permisos para gestionar entidades, equipos, crear partidos y administrar a tus jugadores.
                </p>
                {[
                  { icon: Shield, label: 'Mis Entidades Administradas' },
                  { icon: User,   label: 'Gestión de Plantilla' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest border transition-colors bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#0B1220] dark:border-[#1C2B45] dark:text-white/70 dark:hover:border-[#E31C3D] dark:hover:text-[#E31C3D] rounded-xl"
                  >
                    <Icon className="w-4 h-4 text-[#E31C3D]" /> {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-white/50 mb-4 leading-relaxed">
                  Actualmente solo tienes permisos de lectura sobre el calendario de partidos y torneos. Tus estadísticas serán actualizadas por el equipo técnico.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '0', label: 'Partidos Jugados' },
                    { value: '0', label: 'Goles' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] rounded-2xl shadow-inner">
                      <span className="font-black text-3xl text-slate-900 dark:text-white" style={{ fontFamily: FONT_DISPLAY }}>{value}</span>
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] mt-1 text-slate-400 dark:text-white/40">{label}</span>
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
