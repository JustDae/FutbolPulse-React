import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'


import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'


const registerSchema = z
  .object({
    email: z.string().email('Ingresa un email válido'),
    nombre_completo: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>


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

  useEffect(() => {
    // Limpiar errores previos al montar el componente
    clearError()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
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
        password2: data.confirmPassword
      })
    } catch {
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-white font-sans opacity-0 animate-fade-in">
      
      {/* Back Button */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <Link 
          to="/"
          className="inline-flex items-center justify-center bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/20 transition-all duration-300 hover:scale-[1.05] active:scale-95"
        >
          Volver al inicio &gt;
        </Link>
      </div>

      {/* Right Side: Image (Reversed for register) */}
      <div className="hidden md:flex relative w-full md:w-1/2 bg-slate-900 md:[clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)] z-10 h-[30vh] md:h-screen opacity-0 animate-slide-left [animation-delay:100ms]">
        <img 
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop" 
          alt="Register Background" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-12 right-12 max-w-sm text-right">
          <h2 className="text-3xl font-black text-white leading-tight">Únete al <br/>terreno de juego.</h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">Comienza tu carrera deportiva, crea tu equipo y compite en los mejores torneos.</p>
        </div>
      </div>

      {/* Left Side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 h-screen md:-mr-12 relative z-0 opacity-0 animate-slide-right [animation-delay:200ms]">
        <div className="w-full max-w-md space-y-6 md:pr-16">
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              NUEVO <span className="text-[#e63946]">REGISTRO</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Completa tus datos para crear una nueva cuenta.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            {error && (
              <div className="rounded-none border-l-4 border-[#e63946] bg-red-50 p-4 text-sm text-[#e63946] font-bold">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre_completo" className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Nombre Completo</Label>
              <Input
                id="nombre_completo"
                type="text"
                autoComplete="name"
                placeholder="Juan Pérez"
                aria-invalid={!!errors.nombre_completo}
                className="rounded-none border-slate-300 focus-visible:ring-[#e63946] focus-visible:border-[#e63946] h-12"
                {...register('nombre_completo')}
              />
              {errors.nombre_completo && (
                <p className="text-xs text-[#e63946] font-bold mt-1">{errors.nombre_completo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                aria-invalid={!!errors.email}
                className="rounded-none border-slate-300 focus-visible:ring-[#e63946] focus-visible:border-[#e63946] h-12"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-[#e63946] font-bold mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className="rounded-none border-slate-300 focus-visible:ring-[#e63946] focus-visible:border-[#e63946] h-12"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-[#e63946] font-bold mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                className="rounded-none border-slate-300 focus-visible:ring-[#e63946] focus-visible:border-[#e63946] h-12"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#e63946] font-bold mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-none h-14 bg-[#e63946] hover:bg-[#d62828] text-white font-black text-sm uppercase tracking-widest transition-colors mt-6" 
              disabled={isLoading}
            >
              {isLoading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
            </Button>

            <p className="text-center md:text-left text-xs font-bold text-slate-500 uppercase tracking-wide mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-[#e63946] hover:text-[#d62828] transition-colors underline underline-offset-4"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  )
}
