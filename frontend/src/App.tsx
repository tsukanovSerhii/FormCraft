import { HelpCircle, MessageSquare } from 'lucide-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import AnalyticsPage from '@/pages/AnalyticsPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import AuthPage from '@/pages/AuthPage'
import BuilderPage from '@/pages/BuilderPage'
import ComingSoonPage from '@/pages/ComingSoonPage'
import DashboardPage from '@/pages/DashboardPage'
import LandingPage from '@/pages/LandingPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PreviewPage from '@/pages/PreviewPage'
import PublicFormPage from '@/pages/PublicFormPage'
import ResponsesPage from '@/pages/ResponsesPage'
import SettingsPage from '@/pages/SettingsPage'
import TemplatesPage from '@/pages/TemplatesPage'
import { useAuthStore } from '@/store/authStore'

function HomeRedirect() {
  const { accessToken } = useAuthStore()
  return accessToken ? <Navigate to="/forms" replace /> : <LandingPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/preview/:formId" element={<PreviewPage />} />
        <Route path="/f/:formId" element={<PublicFormPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/forms" element={<DashboardPage />} />
          <Route path="/builder/:formId" element={<BuilderPage />} />
          <Route path="/responses" element={<ResponsesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/support"
            element={<ComingSoonPage title="Support" description="Our help centre is on its way. Until then, reach us by email." icon={HelpCircle} />}
          />
          <Route
            path="/feedback"
            element={<ComingSoonPage title="Feedback" description="We'd love to hear from you. This section is coming soon." icon={MessageSquare} />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
