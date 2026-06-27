import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { AppStateProvider } from './contexts/AppStateProvider'
import { FieldValuesProvider } from './contexts/FieldValuesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider>
      <FieldValuesProvider>
        <App />
      </FieldValuesProvider>
    </AppStateProvider>
  </StrictMode>,
)
