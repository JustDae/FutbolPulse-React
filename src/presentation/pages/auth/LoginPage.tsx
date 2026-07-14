import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, ShoppingBag } from 'lucide-react'

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


const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>


export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const { login, isLoading, error, clearError, user, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (hasHydrated && user) {
      if (from === '/') {
        if (user.is_staff) navigate('/admin', { replace: true })
        else if (user.tipo_usuario === 'Player') navigate('/jugador', { replace: true })
        else if (user.tipo_usuario === 'Coach') navigate('/coach', { replace: true })
        else if (user.tipo_usuario === 'Scout') navigate('/scout', { replace: true })
        else navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }
  }, [user, hasHydrated, from, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    clearError()
    try {
      const loggedUser = await login(data.email, data.password)
      if (from === '/') {
        if (loggedUser.is_staff) navigate('/admin', { replace: true })
        else if (loggedUser.tipo_usuario === 'Player') navigate('/jugador', { replace: true })
        else if (loggedUser.tipo_usuario === 'Coach') navigate('/coach', { replace: true })
        else if (loggedUser.tipo_usuario === 'Scout') navigate('/scout', { replace: true })
        else navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
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
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">FutbolPulse</CardTitle>
          <CardDescription>Inicia sesión para continuar</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

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
                autoComplete="current-password"
                placeholder="⬢⬢⬢⬢⬢⬢⬢⬢"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión⬦
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
