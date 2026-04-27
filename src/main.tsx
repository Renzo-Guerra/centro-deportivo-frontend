import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter >
      <AuthProvider>
        <AppRouter>
          <App />
        </AppRouter >
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
