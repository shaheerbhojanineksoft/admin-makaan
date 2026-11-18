import { Navigate, Route, Routes } from 'react-router-dom'

import AdminShell from './components/AdminShell'
import AdminProfile from './pages/AdminProfile'
import Agencies from './pages/Agencies'
import AgencyQueries from './pages/AgencyQueries'
import Dashboard from './pages/Dashboard'
import Lawyers from './pages/Lawyers'
import Listings from './pages/Listings'
import Login from './pages/Login'
import Recommendations from './pages/Recommendations'
import Reels from './pages/Reels'
import UserQueries from './pages/UserQueries'
import Users from './pages/Users'
import { useAdminSession } from './utils/session'

function Protected({ children }) {
  const session = useAdminSession()
  if (!session.signedIn) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const session = useAdminSession()

  return (
    <Routes>
      <Route
        path="/login"
        element={session.signedIn ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <Protected>
            <AdminShell />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="agencies" element={<Agencies />} />
        <Route path="agency-queries" element={<AgencyQueries />} />
        <Route path="user-queries" element={<UserQueries />} />
        <Route path="reels" element={<Reels />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="listings" element={<Listings />} />
        <Route path="users" element={<Users />} />
        <Route path="lawyers" element={<Lawyers />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to={session.signedIn ? '/' : '/login'} replace />} />
    </Routes>
  )
}
