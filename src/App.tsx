import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { AppRouter } from './presentation/router/AppRouter'
import { useAuthStore } from './presentation/store/auth.store'

export default function App() {
  useEffect(() => {
    void useAuthStore.getState().restoreSession()
  }, [])

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  )
}
