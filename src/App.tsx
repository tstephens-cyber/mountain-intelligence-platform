import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AnalyticsPage from './pages/AnalyticsPage'
import AICoachPage from './pages/AICoachPage'
import Dashboard from './pages/Dashboard'
import DocumentIntelligencePage from './pages/DocumentIntelligencePage'
import SettingsPage from './pages/SettingsPage'
import WorkspacePage from './pages/WorkspacePage'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
