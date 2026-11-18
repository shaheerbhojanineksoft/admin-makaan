import { useMemo, useState } from 'react'
import { Eye, Mail, Phone, Trash2, UserRound } from 'lucide-react'

import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import { deleteUser, getUsers, useAdminStore } from '../utils/adminStore'
import { formatDateTime } from '../utils/format'

/**
 * View popup mirrors Makaan `/profile` card layout:
 * centered avatar + full name / email / phone fields.
 */
function UserProfileView({ user }) {
  return (
    <div className="bg-offwhite p-6 sm:p-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.avatar}
            alt=""
            className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-soft"
          />
          <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">User profile details</p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              Full name
            </p>
            <div className="relative mt-1.5">
              <UserRound
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                aria-hidden="true"
              />
              <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-semibold text-slate-800">
                {user.name || '—'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Email</p>
            <div className="relative mt-1.5">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                aria-hidden="true"
              />
              <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-semibold text-slate-800">
                {user.email || '—'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              Phone number
            </p>
            <div className="relative mt-1.5">
              <Phone
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                aria-hidden="true"
              />
              <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-semibold text-slate-800">
                {user.phone || '—'}
              </p>
            </div>
          </div>

          {user.city ? (
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">City</p>
              <p className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                {user.city}
              </p>
            </div>
          ) : null}

          <p className="text-center text-xs font-semibold text-slate-400">
            Joined {formatDateTime(user.createdAt)} · ID {user.id}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Users() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => getUsers(), [tick])

  function onDelete(id) {
    if (!window.confirm('Delete this user?')) return
    deleteUser(id)
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Seekers"
        title="Users"
        description="Registered user accounts — view matches Makaan profile page, or delete."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.avatar ? (
                        <img
                          src={row.avatar}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-brand/15"
                        />
                      ) : null}
                      <p className="font-bold text-slate-900">{row.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.email}</td>
                  <td className="px-4 py-3 text-slate-600">{row.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{row.city}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <Modal flush onClose={() => setSelected(null)}>
          <UserProfileView user={selected} />
        </Modal>
      ) : null}
    </div>
  )
}
