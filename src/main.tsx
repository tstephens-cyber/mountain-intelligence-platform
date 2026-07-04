import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BusinessContextProvider } from './context/BusinessContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BusinessContextProvider>
      <App />
    </BusinessContextProvider>
  </StrictMode>,
)
