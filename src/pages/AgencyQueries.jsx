import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'

import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import {
  QUERY_STATUSES,
  getAgencyQueries,
  updateAgencyQuery,
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
 * Same fields agency fills on Help & Support “Submit query” form — only these:
 * Subject, Topic, Listing/Recommendation ID, Describe your issue, Attachments, Phone.
 */
function AgencyRequestView({ request }) {
  const attachments = Array.isArray(request.attachments)
    ? request.attachments.filter(Boolean)
    : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={STATUS_VARIANT[request.status] || 'green'}>
          {QUERY_STATUSES[request.status] || request.status}
        </Badge>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">
        Sending as{' '}
        <span className="font-bold text-slate-900">{request.agencyName || 'Agency'}</span>.
      </p>

      <div className="space-y-5">
        <DetailItem label="Subject" value={request.subject} />
        <DetailItem label="Topic" value={request.topic} />
        <DetailItem
          label="Listing / recommendation ID (optional)"
          value={request.relatedId?.trim() ? request.relatedId : '—'}
        />
        <DetailItem label="Describe your issue" value={request.message} />

        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            Attachments (optional)
          </p>
          {attachments.length ? (
            <div className="mt-2 grid grid-cols-2 gap-3 sm:max-w-md">
              {attachments.map((url, index) => (
                <img
                  key={`${url.slice(0, 40)}-${index}`}
                  src={url}
                  alt=""
                  className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-500">No pictures attached.</p>
          )}
        </div>

        <DetailItem label="Phone number" value={request.phone} />
      </div>
    </div>
  )
}

export default function AgencyQueries() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('pending')
  const rows = useMemo(() => getAgencyQueries(), [tick])

  function openView(row) {
    setSelected(row)
    setReply(row.reply || '')
    setStatus(row.status || 'pending')
  }

  function handleSaveReply(event) {
    event.preventDefault()
    if (!selected) return
    const nextStatus = reply.trim() ? 'responded' : status
    updateAgencyQuery(selected.id, {
      reply: reply.trim(),
      status: nextStatus,
    })
    const updated = getAgencyQueries().find((item) => item.id === selected.id)
    setSelected(updated || null)
    setStatus(nextStatus)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support"
        title="Agency queries"
        description="Help & support requests from agencies — same fields they submitted."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Subject</th>
                <th className="px-4 py-3.5">Agency</th>
                <th className="px-4 py-3.5">Topic</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Submitted</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-slate-900">{row.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{row.agencyName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.topic}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[row.status] || 'green'}>
                      {QUERY_STATUSES[row.status] || row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(row.createdAt)}</td>
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
          eyebrow="Help & support"
          title={selected.subject || 'Agency query'}
          onClose={() => setSelected(null)}
        >
          <div className="space-y-5">
            <AgencyRequestView request={selected} />

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
                  placeholder="Write a reply for the agency…"
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
