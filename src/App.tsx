import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { ReactLenis } from 'lenis/react'
import { AppRouter } from './presentation/router/AppRouter'
import { useAuthStore } from './presentation/store/auth.store'
import { CustomCursor } from './presentation/components/CustomCursor'

export default function App() {
  useEffect(() => {
    void useAuthStore.getState().restoreSession()
  }, [])

  return (
    <ReactLenis root>
      <CustomCursor />
      <AppRouter />
      <Toaster position="top-right" richColors />
    </ReactLenis>
  )
}
