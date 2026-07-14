import { axiosClient } from '@/infrastructure/http/axios-client'  
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import type { AuthRepository, AuthSession } from '@/domain/ports/auth.repository'
import type { LoggedUser } from '@/domain/entities/logged-user.entity'
import type { AuthTokens } from '@/domain/entities/auth-tokens.entity'

interface RawAuthResponse extends LoggedUser {
  access: string
  refresh: string
}


function toAuthSession(raw: RawAuthResponse): AuthSession {
  const { access, refresh, ...user } = raw
  return { user, tokens: { access, refresh } }
}

export class AxiosAuthRepository implements AuthRepository {

  async login(email: string, password: string): Promise<AuthSession> {
    try {
      const { data } = await axiosClient.post<RawAuthResponse>('/auth/login/', {
        email,
        password,
      })
      const session = toAuthSession(data)
      localTokenStorage.setTokens(session.tokens.access, session.tokens.refresh)
      return session
    } catch (err) {
      throw parseApiError(err)
    }
  }


  async register(registerData: import('../../application/dtos/register.dto').RegisterDto): Promise<AuthSession> {
    try {
      const { data } = await axiosClient.post<RawAuthResponse>('/auth/register/', registerData)
      const session = toAuthSession(data)
      localTokenStorage.setTokens(session.tokens.access, session.tokens.refresh)
      return session
    } catch (err) {
      throw parseApiError(err)
    }
  }


  async logout(): Promise<void> {
    const refresh = localTokenStorage.getRefreshToken()
    if (refresh) {
      try {
        await axiosClient.post('/auth/logout/', { refresh }) 
      } catch {
      
      }
    }
    localTokenStorage.clearTokens()
  }


  async getCurrentUser(): Promise<LoggedUser> {
    try {
      const { data } = await axiosClient.get<LoggedUser>('/users/profile/')
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  getStoredTokens(): AuthTokens | null {
    return localTokenStorage.getTokens()
  }

  clearLocalSession(): void {
    localTokenStorage.clearTokens()
  }
}
