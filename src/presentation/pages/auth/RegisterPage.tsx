import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'

import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'


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
    <div className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 md:top-8 md:left-8"
        asChild
      >
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 rounded-full bg-primary p-3 text-primary-foreground">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Regístrate en FutbolPulse</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="nombre_completo">Nombre Completo</Label>
              <Input
                id="nombre_completo"
                type="text"
                autoComplete="name"
                placeholder="Juan Pérez"
                aria-invalid={!!errors.nombre_completo}
                {...register('nombre_completo')}
              />
              {errors.nombre_completo && (
                <p className="text-xs text-destructive">{errors.nombre_completo.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="⬢⬢⬢⬢⬢⬢⬢⬢"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="⬢⬢⬢⬢⬢⬢⬢⬢"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando⬦
                </>
              ) : (
                'Registrarse'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
