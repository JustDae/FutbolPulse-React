import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/presentation/store/auth.store'
import { ArrowLeft, ArrowRight, Mail, Lock, User } from 'lucide-react'
import ctaBgImg from '@/assets/cta_bg.jpg'

const NAVY = '#0B1220'
const RED = '#E63946'
const FONT_DISPLAY = "'Barlow Condensed', sans-serif"

const registerSchema = z
  .object({
    email: z.string().email('Ingresa un email válido'),
    nombre_completo: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

function StyledInput({
  id, type, placeholder, autoComplete, hasError, icon: Icon, regProps,
}: {
  id: string; type: string; placeholder: string; autoComplete: string;
  hasError: boolean; icon: React.ElementType; regProps: object;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...regProps}
        className="w-full h-11 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-300 outline-none transition-all"
        style={{ border: `1px solid ${hasError ? RED : '#E2E8F0'}`, background: '#FAFAFA' }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = NAVY; (e.currentTarget as HTMLElement).style.background = '#FFF'; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = hasError ? RED : '#E2E8F0'; (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}
      />
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerAction, isLoading, error, clearError, user, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (hasHydrated && user) {
      if (user.tipo_usuario === 'Player') navigate('/jugador', { replace: true })
      else if (user.tipo_usuario === 'Coach') navigate('/coach', { replace: true })
      else if (user.tipo_usuario === 'Scout') navigate('/scout', { replace: true })
      else navigate('/admin', { replace: true })
    }
  }, [user, hasHydrated, navigate])

  useEffect(() => { clearError() }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    clearError()
    try {
      await registerAction({
        email: data.email,
        nombre_completo: data.nombre_completo,
        tipo_usuario: 'Player',
        password: data.password,
        password2: data.confirmPassword,
      })
    } catch { }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      <div className="flex-1 flex flex-col bg-white">

        <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-0">
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '18px', color: RED }}>FÚTBOL</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '18px', color: NAVY }}>PULSE</span>
          </Link>
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Inicio
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">

            <div className="mb-7">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Nueva cuenta</span>
              <h1
                className="uppercase mt-1 leading-none"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '40px', letterSpacing: '-0.02em', color: NAVY }}
              >
                CREAR<br />CUENTA
              </h1>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 mb-5 border-l-[3px]" style={{ borderColor: RED, background: '#FEF2F2' }}>
                <span className="text-sm font-semibold" style={{ color: RED }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              <div>
                <label htmlFor="nombre_completo" className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5 text-slate-500">
                  Nombre Completo
                </label>
                <StyledInput id="nombre_completo" type="text" placeholder="Juan Pérez" autoComplete="name"
                  hasError={!!errors.nombre_completo} icon={User} regProps={register('nombre_completo')} />
                {errors.nombre_completo && <p className="text-[10px] font-bold mt-1" style={{ color: RED }}>{errors.nombre_completo.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5 text-slate-500">
                  Correo Electrónico
                </label>
                <StyledInput id="email" type="email" placeholder="tu@email.com" autoComplete="email"
                  hasError={!!errors.email} icon={Mail} regProps={register('email')} />
                {errors.email && <p className="text-[10px] font-bold mt-1" style={{ color: RED }}>{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5 text-slate-500">
                  Contraseña
                </label>
                <StyledInput id="password" type="password" placeholder="••••••••" autoComplete="new-password"
                  hasError={!!errors.password} icon={Lock} regProps={register('password')} />
                {errors.password && <p className="text-[10px] font-bold mt-1" style={{ color: RED }}>{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5 text-slate-500">
                  Confirmar Contraseña
                </label>
                <StyledInput id="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password"
                  hasError={!!errors.confirmPassword} icon={Lock} regProps={register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-[10px] font-bold mt-1" style={{ color: RED }}>{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:opacity-50 mt-1"
                style={{ background: RED }}
              >
                {isLoading ? 'Registrando...' : <><span>Crear cuenta</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">o</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-bold hover:opacity-75 transition-opacity" style={{ color: RED }}>
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${RED}, ${NAVY})` }} />
      </div>

      <div
        className="hidden lg:flex relative w-[55%] shrink-0 flex-col overflow-hidden"
        style={{
          backgroundImage: `url(${ctaBgImg})`,
          backgroundPosition: 'center 35%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0B1220',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(11,18,32,0.3) 0%, rgba(11,18,32,0.05) 40%, rgba(11,18,32,0.8) 100%)' }}
        />

        <div className="relative z-10 flex items-center justify-between p-8">
          <Link to="/" className="flex items-center gap-0">
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '20px', color: RED }}>FÚTBOL</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '20px', color: '#FFF' }}>PULSE</span>
            <span className="ml-1.5 w-1.5 h-1.5" style={{ background: RED }} />
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
        </div>

        <div className="relative z-10 mt-auto p-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[3px]" style={{ background: RED }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">Únete</span>
          </div>
          <h2
            className="uppercase text-white mb-3"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '52px', lineHeight: 0.92, letterSpacing: '-0.02em' }}
          >
            ÚNETE AL<br />TERRENO<br /><span style={{ color: RED }}>DE JUEGO.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs text-white/50">
            Comienza tu carrera deportiva, crea tu equipo y compite en los mejores torneos.
          </p>
          <div className="flex gap-2 mt-8">
            <div className="w-4 h-4" style={{ background: RED, opacity: 0.9 }} />
            <div className="w-4 h-4" style={{ background: RED, opacity: 0.4 }} />
            <div className="w-4 h-4" style={{ background: RED, opacity: 0.15 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
