import axios, { type AxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/infrastructure/config/api.config'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import { ApiException } from '@/domain/exceptions/api.exception'
import { parseApiError } from './parse-api-error'

export const AUTH_EXPIRED_EVENT = 'authExpired'

export interface AuthExpiredEventDetail {
  reason: string
}

export const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localTokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(parseApiError(error)),
)

let isRefreshing = false

let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

function dispatchAuthExpired(reason: string) {
  const event = new CustomEvent<AuthExpiredEventDetail>(AUTH_EXPIRED_EVENT, {
    detail: { reason },
  })
  window.dispatchEvent(event)
}

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const isAuthRoute = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')

    if (error.response?.status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(parseApiError(error))
    }

    originalRequest._retry = true

    const refreshToken = localTokenStorage.getRefreshToken()
    if (!refreshToken) {
      localTokenStorage.clearTokens()
      dispatchAuthExpired('No refresh token available')
      return Promise.reject(
        new ApiException(401, 'Sesión expirada. Por favor inicia sesión de nuevo.'),
      )
    }

    if (isRefreshing) {
      return new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve)
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return axiosClient(originalRequest)
      })
    }

    isRefreshing = true

    try {
      const { data } = await axios.post<{ access: string }>(
        `${API_CONFIG.BASE_URL}/auth/token/refresh/`,
        { refresh: refreshToken },
        { timeout: API_CONFIG.TIMEOUT },
      )

      const newAccessToken = data.access

      localTokenStorage.setTokens(newAccessToken, refreshToken)

      notifySubscribers(newAccessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }

      return axiosClient(originalRequest)
    } catch (refreshError) {
      localTokenStorage.clearTokens()
      refreshSubscribers = []
      dispatchAuthExpired('Refresh token invalid or expired')

      return Promise.reject(
        new ApiException(401, 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.'),
      )
    } finally {
      isRefreshing = false
    }
  },
)
