import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Building2,
  Clapperboard,
  Headphones,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  Sparkles,
  UserCog,
  Users,
  X,
} from 'lucide-react'

import Logo from './ui/Logo'
import { useAdminStore } from '../utils/adminStore'
import {
  displayOrDash,
  signOutAdmin,
  useAdminSession,
} from '../utils/session'

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
  const location = useLocation()
  const session = useAdminSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const displayName = displayOrDash(session.name || session.admin?.name)
  const displayEmail = displayOrDash(session.email || session.admin?.email)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  function handleSignOut() {
    signOutAdmin()
    navigate('/login', { replace: true })
  }

  const sidebar = (
    <>
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-b border-slate-100 px-4 py-4">
        <p className="truncate text-sm font-extrabold text-slate-900">{displayName}</p>
        <p className="truncate text-[11px] font-medium text-slate-500">{displayEmail}</p>
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
    </>
  )

  return (
    <div className="min-h-screen bg-offwhite lg:flex">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200/80 bg-white shadow-xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-72 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand/30 hover:text-brand"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-slate-900">{displayName}</p>
            <p className="truncate text-[11px] font-medium text-slate-500">{displayEmail}</p>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
