import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const AICoachPage = lazy(() => import('./pages/AICoachPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DocumentIntelligencePage = lazy(() => import('./pages/DocumentIntelligencePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6 text-sm text-slate-300">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="ai-coach" element={<AICoachPage />} />
            <Route path="documents" element={<DocumentIntelligencePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="workspace" element={<WorkspacePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
