import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'

import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import {
  QUERY_STATUSES,
  getUserQueries,
  updateUserQuery,
  useAdminStore,
} from '../utils/adminStore'
import { formatDateTime } from '../utils/format'

const STATUS_VARIANT = {
  pending: 'amber',
  in_review: 'green',
  responded: 'solid',
}

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold whitespace-pre-wrap text-slate-800">
        {value == null || value === '' ? '—' : value}
      </p>
    </div>
  )
}

/**
 * Read-only mirror of Contact Us “Send Us a Message” payload:
 * Full Name, Email Address, Phone Number (optional), Reason for Contact, Message.
 */
function ContactUsQueryView({ request }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={STATUS_VARIANT[request.status] || 'green'}>
          {QUERY_STATUSES[request.status] || request.status}
        </Badge>
        <span className="text-xs font-semibold text-slate-500">
          Submitted {formatDateTime(request.createdAt)}
        </span>
      </div>

      {/* Same grid as ContactUs form */}
      <div className="grid gap-5 sm:grid-cols-2">
        <DetailItem label="Full Name" value={request.name} />
        <DetailItem label="Email Address" value={request.email} />
        <DetailItem
          label="Phone Number"
          value={request.phone?.trim() ? request.phone : '—'}
        />
        <DetailItem label="Reason for Contact" value={request.reason} />
        <div className="sm:col-span-2">
          <DetailItem label="Message" value={request.message} />
        </div>
      </div>
    </div>
  )
}

export default function UserQueries() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('pending')
  const rows = useMemo(() => getUserQueries(), [tick])

  function openView(row) {
    setSelected(row)
    setReply(row.reply || '')
    setStatus(row.status || 'pending')
  }

  function handleSaveReply(event) {
    event.preventDefault()
    if (!selected) return
    const nextStatus = reply.trim() ? 'responded' : status
    updateUserQuery(selected.id, {
      reply: reply.trim(),
      status: nextStatus,
    })
    const updated = getUserQueries().find((item) => item.id === selected.id)
    setSelected(updated || null)
    setStatus(nextStatus)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support"
        title="User queries"
        description="Messages users send to admin from Contact Us."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Full name</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.email || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{row.phone || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.reason || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[row.status] || 'green'}>
                      {QUERY_STATUSES[row.status] || row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openView(row)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <Modal
          wide
          eyebrow="Send Us a Message"
          title={selected.name || 'User message'}
          onClose={() => setSelected(null)}
        >
          <div className="space-y-5">
            <ContactUsQueryView request={selected} />

            <form onSubmit={handleSaveReply} className="space-y-4 border-t border-slate-100 pt-4">
              <label className="block">
                <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  Status
                </span>
                <select
                  className={FIELD}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {Object.entries(QUERY_STATUSES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  Admin reply
                </span>
                <textarea
                  className={`${FIELD} min-h-[110px] resize-y`}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Reply to this Contact Us message…"
                />
              </label>

              {selected.reply ? (
                <div className="rounded-xl border border-brand/15 bg-brand-soft/50 p-4">
                  <p className="text-[11px] font-bold tracking-wide text-brand uppercase">
                    Saved admin response
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed whitespace-pre-wrap text-slate-800">
                    {selected.reply}
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
              >
                Save reply & status
              </button>
            </form>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
