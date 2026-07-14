import type { LoggedUser } from '../entities/logged-user.entity'
import type { AuthTokens } from '../entities/auth-tokens.entity'
import type { RegisterDto } from '../../application/dtos/register.dto'

export interface AuthSession {
  user: LoggedUser
  tokens: AuthTokens
}

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthSession>
  register(data: RegisterDto): Promise<AuthSession>
  logout(): Promise<void>
  getCurrentUser(): Promise<LoggedUser>
  getStoredTokens(): AuthTokens | null
  clearLocalSession(): void
}
