import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import { i18n } from './i18n/config'
import { App } from './App.tsx'
import { AppStateProvider } from './contexts/AppStateProvider'
import { FieldValuesProvider } from './contexts/FieldValuesProvider'
import { ServiceRecordProvider } from './contexts/ServiceRecordProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <AppStateProvider>
        <ServiceRecordProvider>
          <FieldValuesProvider>
            <App />
          </FieldValuesProvider>
        </ServiceRecordProvider>
      </AppStateProvider>
    </I18nextProvider>
  </StrictMode>,
)
