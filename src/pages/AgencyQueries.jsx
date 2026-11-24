import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Eye,
  ImageOff,
  MessageSquareText,
  Phone,
  SendHorizontal,
  Tag,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import { QUERY_STATUSES } from '../utils/adminStore'
import { adminApi } from '../utils/api'
import { formatDateTime } from '../utils/format'

const STATUS_VARIANT = {
  pending: 'amber',
  in_review: 'green',
  responded: 'solid',
}

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In review' },
  { value: 'responded', label: 'Responded' },
]

const FIELD =
  'mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function MetaChip({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 px-3.5 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
        {Icon ? <Icon className="h-3.5 w-3.5 text-brand" /> : null}
        {label}
      </div>
      <p className="mt-1.5 text-sm font-bold text-slate-800 break-words">{value || '—'}</p>
    </div>
  )
}

function upsertRow(list, next) {
  if (!next?._id) return list
  const exists = list.some((item) => item._id === next._id)
  if (!exists) return [next, ...list]
  return list.map((item) => (item._id === next._id ? next : item))
}

export default function AgencyQueries() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [replyError, setReplyError] = useState('')
  const [openingId, setOpeningId] = useState('')
  const [responding, setResponding] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await adminApi('/support/agency-requests?status=all', {
          auth: true,
        })
        if (!cancelled) setRows(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) {
          setRows([])
          setError(err?.message || 'Could not load agency queries.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const counts = useMemo(() => {
    const next = { all: rows.length, pending: 0, in_review: 0, responded: 0 }
    rows.forEach((item) => {
      if (item.status in next) next[item.status] += 1
    })
    return next
  }, [rows])

  const visibleRows = useMemo(() => {
    if (statusFilter === 'all') return rows
    return rows.filter((item) => item.status === statusFilter)
  }, [rows, statusFilter])

  async function openView(row) {
    if (!row?._id || openingId) return
    setOpeningId(row._id)
    setActionError('')
    try {
      const updated = await adminApi(
        `/support/agency-requests/${row._id}/in-review`,
        {
          method: 'PATCH',
          auth: true,
        },
      )
      const next = updated || { ...row, status: 'in_review' }
      setRows((list) => upsertRow(list, next))
      setSelected(next)
      setReply(next.response || '')
      setReplyError('')
    } catch (err) {
      setActionError(err?.message || 'Could not open this request.')
    } finally {
      setOpeningId('')
    }
  }

  async function handleRespond(event) {
    event.preventDefault()
    if (!selected?._id || responding) return
    const response = reply.trim()
    if (!response) {
      setReplyError('Please enter a response before submitting.')
      setActionError('')
      return
    }

    setResponding(true)
    setReplyError('')
    setActionError('')
    try {
      const updated = await adminApi(
        `/support/agency-requests/${selected._id}/respond`,
        {
          method: 'PATCH',
          auth: true,
          body: JSON.stringify({ response }),
        },
      )
      const next = updated || {
        ...selected,
        response,
        status: 'responded',
      }
      setRows((list) => upsertRow(list, next))
      setSelected(null)
      setReply('')
      setReplyError('')
      setActionError('')
    } catch (err) {
      setActionError(err?.message || 'Could not send response.')
    } finally {
      setResponding(false)
    }
  }

  const alreadyResponded = selected?.status === 'responded'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support"
        title="Agency queries"
        description="Help & support requests from agencies — same fields they submitted."
      />

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((item) => {
          const active = statusFilter === item.value
          const count = counts[item.value] ?? 0
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatusFilter(item.value)}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                active
                  ? 'bg-brand text-white shadow-sm shadow-brand/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:text-brand'
              }`}
            >
              {item.label} ({count})
            </button>
          )
        })}
      </div>

      {actionError && !selected ? (
        <p className="text-sm font-semibold text-rose-600">{actionError}</p>
      ) : null}

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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                    Loading agency queries…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm font-semibold text-rose-600">
                    {error}
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                    No agency queries found.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-slate-900">{row.subject}</td>
                    <td className="px-4 py-3 text-slate-600">{row.agencyName || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.topic}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[row.status] || 'green'}>
                        {QUERY_STATUSES[row.status] || row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openView(row)}
                        disabled={openingId === row._id}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft disabled:cursor-wait disabled:opacity-60"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {openingId === row._id ? 'Opening…' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <Modal
          wide
          flush
          onClose={() => {
            setSelected(null)
            setReplyError('')
            setActionError('')
          }}
        >
          {(() => {
            const attachments = Array.isArray(selected.attachments)
              ? selected.attachments.filter(Boolean)
              : []

            return (
              <div>
                <div className="relative overflow-hidden border-b border-brand/10 bg-gradient-to-br from-brand-soft via-white to-emerald-50/40 px-5 py-6 sm:px-7">
                  <div className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-brand/10 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-emerald-200/30 blur-2xl" />
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
                        Agency support
                      </p>
                      <Badge variant={STATUS_VARIANT[selected.status] || 'green'}>
                        {QUERY_STATUSES[selected.status] || selected.status}
                      </Badge>
                    </div>
                    <h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold leading-tight text-slate-900 sm:text-[1.75rem]">
                      {selected.subject || 'Agency query'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Submitted {formatDateTime(selected.createdAt)}
                      {selected.updatedAt
                        ? ` · Updated ${formatDateTime(selected.updatedAt)}`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-7">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <MetaChip
                      icon={Building2}
                      label="Agency"
                      value={selected.agencyName || 'Agency'}
                    />
                    <MetaChip icon={Tag} label="Topic" value={selected.topic} />
                    <MetaChip icon={Phone} label="Phone" value={selected.phone} />
                  </div>

                  <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                      <MessageSquareText className="h-4 w-4 text-brand" />
                      <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                        Agency message
                      </p>
                    </div>
                    <div className="border-l-4 border-brand/70 px-4 py-4 sm:px-5">
                      <p className="text-sm leading-relaxed font-semibold whitespace-pre-wrap text-slate-800">
                        {selected.message || '—'}
                      </p>
                    </div>
                  </section>

                  <section>
                    <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                      Attachments
                    </p>
                    {attachments.length ? (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {attachments.map((url, index) => (
                          <a
                            key={`${url.slice(0, 40)}-${index}`}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                          >
                            <img
                              src={url}
                              alt=""
                              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500">
                        <ImageOff className="h-4 w-4" />
                        No pictures attached.
                      </div>
                    )}
                  </section>

                  {alreadyResponded ? (
                    <section className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft/80 via-white to-white p-4 sm:p-5">
                      <p className="text-[11px] font-extrabold tracking-wide text-brand uppercase">
                        Admin response
                      </p>
                      <p className="mt-3 text-sm font-semibold leading-relaxed whitespace-pre-wrap text-slate-800">
                        {selected.response || '—'}
                      </p>
                    </section>
                  ) : (
                    <form
                      onSubmit={handleRespond}
                      className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5"
                    >
                      <div>
                        <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                          Write your response
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          This reply will be shared with the agency and mark the request as responded.
                        </p>
                      </div>
                      <label className="block">
                        <textarea
                          className={`${FIELD} min-h-[120px] resize-y`}
                          value={reply}
                          onChange={(e) => {
                            setReply(e.target.value)
                            if (replyError) setReplyError('')
                          }}
                          placeholder="Share a clear update, next step, or resolution…"
                        />
                        {replyError ? (
                          <p className="mt-1.5 text-xs font-bold text-rose-600">{replyError}</p>
                        ) : null}
                      </label>

                      {actionError ? (
                        <p className="text-sm font-semibold text-rose-600">{actionError}</p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={responding}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
                      >
                        <SendHorizontal className="h-4 w-4" />
                        {responding ? 'Responding…' : 'Respond'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })()}
        </Modal>
      ) : null}
    </div>
  )
}
