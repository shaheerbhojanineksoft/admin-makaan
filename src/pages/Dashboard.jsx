import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Building2,
  Clapperboard,
  Headphones,
  Home,
  Inbox,
  Scale,
  Sparkles,
  Users,
} from 'lucide-react'

import AnalyticsPanel from '../components/AnalyticsPanel'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import {
  getAgencies,
  getAgencyQueries,
  getLawyers,
  getListings,
  getRecommendations,
  getReels,
  getUserQueries,
  getUsers,
  useAdminStore,
} from '../utils/adminStore'

const CARDS = [
  { key: 'agencies', label: 'Agencies', to: '/agencies', icon: Building2, getter: getAgencies },
  {
    key: 'agency-queries',
    label: 'Agency queries',
    to: '/agency-queries',
    icon: Headphones,
    getter: getAgencyQueries,
  },
  {
    key: 'user-queries',
    label: 'User queries',
    to: '/user-queries',
    icon: Inbox,
    getter: getUserQueries,
  },
  { key: 'reels', label: 'Reels', to: '/reels', icon: Clapperboard, getter: getReels },
  {
    key: 'recommendations',
    label: 'Recommendations',
    to: '/recommendations',
    icon: Sparkles,
    getter: getRecommendations,
  },
  { key: 'listings', label: 'Listings', to: '/listings', icon: Home, getter: getListings },
  { key: 'users', label: 'Users', to: '/users', icon: Users, getter: getUsers },
  { key: 'lawyers', label: 'Lawyers', to: '/lawyers', icon: Scale, getter: getLawyers },
]

function isOpenStatus(status) {
  return status === 'pending' || status === 'in_review'
}

function countOpen(list) {
  const open = list.filter((item) => isOpenStatus(item.status))
  return {
    total: open.length,
    pending: open.filter((item) => item.status === 'pending').length,
    inReview: open.filter((item) => item.status === 'in_review').length,
  }
}

function AlertCard({ title, href, counts, badgeLabel, badgeVariant }) {
  const hasOpen = counts.total > 0

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-5 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-extrabold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            {hasOpen
              ? `${counts.total} open ${counts.total === 1 ? 'query needs' : 'queries need'} attention.`
              : 'No pending or in-review queries right now.'}
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        {hasOpen ? (
          <Link
            to={href}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 transition hover:border-brand/20 hover:bg-brand-soft/40"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge variant={badgeVariant}>{badgeLabel}</Badge>
              <Badge variant="amber">Pending · {counts.pending}</Badge>
              <Badge variant="green">In review · {counts.inReview}</Badge>
            </div>
            <span className="text-xs font-bold text-brand">Review →</span>
          </Link>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 text-sm font-semibold text-slate-500">
            All clear — nothing waiting.
          </div>
        )}
      </div>
    </section>
  )
}

export default function Dashboard() {
  const tick = useAdminStore()

  const agencyCounts = useMemo(() => countOpen(getAgencyQueries()), [tick])
  const userCounts = useMemo(() => countOpen(getUserQueries()), [tick])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Admin dashboard"
        description="Counts, analytics trends and open query alerts."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ key, label, to, icon: Icon, getter }) => {
          const count = getter().length
          return (
            <Link
              key={key}
              to={to}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <p className="mt-2 font-display text-3xl font-extrabold text-slate-900">{count}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <AnalyticsPanel tick={tick} />

      <div className="grid gap-4 lg:grid-cols-2">
        <AlertCard
          title="Agency queries you haven't seen yet"
          href="/agency-queries"
          counts={agencyCounts}
          badgeLabel="Agency"
          badgeVariant="slate"
        />
        <AlertCard
          title="User queries you haven't seen yet"
          href="/user-queries"
          counts={userCounts}
          badgeLabel="User"
          badgeVariant="green"
        />
      </div>
    </div>
  )
}
