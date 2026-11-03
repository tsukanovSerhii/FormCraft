import { HelpCircle, Loader2, MessageSquare } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import { useAuthStore } from '@/store/authStore'

// Route-level code splitting keeps the landing page bundle small
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'))
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const BuilderPage = lazy(() => import('@/pages/BuilderPage'))
const ComingSoonPage = lazy(() => import('@/pages/ComingSoonPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const PreviewPage = lazy(() => import('@/pages/PreviewPage'))
const PublicFormPage = lazy(() => import('@/pages/PublicFormPage'))
const ResponsesPage = lazy(() => import('@/pages/ResponsesPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'))
const WorkspaceSettingsPage = lazy(() => import('@/pages/WorkspaceSettingsPage'))

function HomeRedirect() {
  const { accessToken } = useAuthStore()
  return accessToken ? <Navigate to="/forms" replace /> : <LandingPage />
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 size={24} className="animate-spin text-land-accent" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
            <Route path="/settings/workspace/:workspaceId" element={<WorkspaceSettingsPage />} />
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
      </Suspense>
    </BrowserRouter>
  )
}

export default App
