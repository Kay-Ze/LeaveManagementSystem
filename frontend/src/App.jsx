import { Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import SideBar from './components/SideBar'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import WaitingApprovalPage from './pages/WaitingApprovalPage'
import { getCurrentUser } from './services/authService'

const AppLayout = ({ children, noPadding = false }) => {
  return (
    <div id='main_page'>
      <div className='flex h-screen'>
        <SideBar />
        <div className={`flex-1 h-screen overflow-y-auto ${noPadding ? '' : 'pb-10'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role === 'employee' && (user.status === 'pending' || user.pendingApproval)) {
    return <Navigate to="/waiting-approval" replace />
  }
  return children
}

const PublicRoute = ({ children }) => {
  const user = getCurrentUser()
  if (user) {
    if (user.role === 'employee' && (user.status === 'pending' || user.pendingApproval)) {
      return <Navigate to="/waiting-approval" replace />
    }
    return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />
  }
  return children
}

const RootRedirect = () => {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'employee' && (user.status === 'pending' || user.pendingApproval)) {
    return <Navigate to="/waiting-approval" replace />
  }
  return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />
}

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/waiting-approval"
        element={<WaitingApprovalPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {getCurrentUser()?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <AppLayout noPadding>
                <Dashboard />
              </AppLayout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {getCurrentUser()?.role !== 'admin' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AppLayout noPadding>
                <AdminDashboard />
              </AppLayout>
            )}
          </ProtectedRoute>
        }
      />
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default App
