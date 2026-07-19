
export interface LocalTokens {
  access: string
  refresh: string
}

const KEYS = {
  ACCESS: 'futbolpulse_access',
  REFRESH: 'futbolpulse_refresh',
} as const

export const localTokenStorage = {
  getTokens(): LocalTokens | null {
    const access = localStorage.getItem(KEYS.ACCESS)
    const refresh = localStorage.getItem(KEYS.REFRESH)
    if (!access || !refresh) return null
    return { access, refresh }
  },

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(KEYS.ACCESS, access)
    localStorage.setItem(KEYS.REFRESH, refresh)
  },

  clearTokens(): void {
    localStorage.removeItem(KEYS.ACCESS)
    localStorage.removeItem(KEYS.REFRESH)
  },

  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH)
  },
}
