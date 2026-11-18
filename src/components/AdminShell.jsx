import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Building2,
  Clapperboard,
  Headphones,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Scale,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react'

import Logo from './ui/Logo'
import { getAdminProfile, useAdminStore } from '../utils/adminStore'
import { signOutAdmin } from '../utils/session'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/agencies', label: 'Agencies', icon: Building2 },
  { to: '/agency-queries', label: 'Agency queries', icon: Headphones },
  { to: '/user-queries', label: 'User queries', icon: Inbox },
  { to: '/reels', label: 'Reels', icon: Clapperboard },
  { to: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { to: '/listings', label: 'Listings', icon: Home },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/profile', label: 'Admin profile', icon: UserCog },
]

function linkClass({ isActive }) {
  return `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
    isActive
      ? 'bg-brand text-white shadow-md shadow-brand/20'
      : 'text-slate-600 hover:bg-brand-soft hover:text-brand'
  }`
}

export default function AdminShell() {
  useAdminStore()
  const navigate = useNavigate()
  const profile = getAdminProfile()

  function handleSignOut() {
    signOutAdmin()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-offwhite">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white sm:w-72">
        <div className="border-b border-slate-100 px-4 py-4">
          <Logo />
        </div>

        <div className="border-b border-slate-100 px-4 py-4">
          <p className="truncate text-sm font-extrabold text-slate-900">{profile.name}</p>
          <p className="truncate text-[11px] font-medium text-slate-500">{profile.email}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
