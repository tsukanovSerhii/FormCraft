import { HelpCircle, MessageSquare, Settings } from 'lucide-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AnalyticsPage from '@/pages/AnalyticsPage'
import BuilderPage from '@/pages/BuilderPage'
import ComingSoonPage from '@/pages/ComingSoonPage'
import DashboardPage from '@/pages/DashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PreviewPage from '@/pages/PreviewPage'
import ResponsesPage from '@/pages/ResponsesPage'
import TemplatesPage from '@/pages/TemplatesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/forms" replace />} />
        <Route path="/forms" element={<DashboardPage />} />
        <Route path="/builder/:formId" element={<BuilderPage />} />
        <Route path="/responses" element={<ResponsesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/preview/:formId" element={<PreviewPage />} />
        <Route
          path="/settings"
          element={<ComingSoonPage title="Settings" description="Workspace settings and integrations are coming soon." icon={Settings} />}
        />
        <Route
          path="/support"
          element={<ComingSoonPage title="Support" description="Our help centre is on its way. Until then, reach us by email." icon={HelpCircle} />}
        />
        <Route
          path="/feedback"
          element={<ComingSoonPage title="Feedback" description="We'd love to hear from you. This section is coming soon." icon={MessageSquare} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
