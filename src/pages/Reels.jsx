import { useMemo, useState } from 'react'
import { Ban, CheckCircle2, Eye, Trash2 } from 'lucide-react'

import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import {
  deleteReel,
  getReels,
  setReelDisabled,
  useAdminStore,
} from '../utils/adminStore'
import { formatDateTime } from '../utils/format'

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</p>
    </div>
  )
}

function ReelDetail({ reel }) {
  return (
    <div className="space-y-5">
      {reel.video ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
          <video
            key={reel.id}
            src={reel.video}
            poster={reel.cover}
            controls
            playsInline
            className="mx-auto max-h-[420px] w-full object-contain"
          />
          {reel.durationSec ? (
            <p className="bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white">
              Duration: {Math.round(reel.durationSec)}s
            </p>
          ) : null}
        </div>
      ) : (
        <img
          src={reel.cover}
          alt=""
          className="aspect-video w-full rounded-xl bg-brand-soft object-cover"
        />
      )}

      {reel.caption ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Caption</p>
          <p className="mt-2 text-sm leading-relaxed font-medium text-slate-700">{reel.caption}</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Detail label="Agency" value={reel.agencyName} />
        <Detail label="Purpose" value={reel.purpose} />
        <Detail label="City" value={reel.city} />
        <Detail label="Area" value={reel.area} />
        <Detail label="Project type" value={reel.projectType} />
        <Detail
          label="Duration"
          value={reel.durationSec ? `${Math.round(reel.durationSec)}s` : null}
        />
        <Detail label="Status" value={reel.disabled ? 'Disabled' : 'Active'} />
        <Detail label="Created" value={formatDateTime(reel.createdAt)} />
      </div>
    </div>
  )
}

export default function Reels() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => getReels(), [tick])

  function onDelete(id) {
    if (!window.confirm('Delete this reel?')) return
    deleteReel(id)
    if (selected?.id === id) setSelected(null)
  }

  function onToggle(row) {
    const next = !row.disabled
    if (
      !window.confirm(
        next ? 'Disable this reel on the public site?' : 'Enable this reel again?',
      )
    ) {
      return
    }
    setReelDisabled(row.id, next)
    if (selected?.id === row.id) setSelected({ ...row, disabled: next })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Reels"
        description="Agency reels — review details, play video, enable/disable, or delete."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Reel</th>
                <th className="px-4 py-3.5">Agency</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Area</th>
                <th className="px-4 py-3.5">Purpose</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50/80 ${row.disabled ? 'opacity-75' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.cover}
                        alt=""
                        className="h-14 w-10 rounded-lg bg-brand-soft object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">{row.title}</p>
                        {row.caption ? (
                          <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                            {row.caption}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.agencyName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.city || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.area || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.purpose || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.projectType || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {row.durationSec ? `${Math.round(row.durationSec)}s` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.disabled ? 'slate' : 'green'}>
                      {row.disabled ? 'Disabled' : 'Active'}
                    </Badge>
                  </td>
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
                        onClick={() => onToggle(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        {row.disabled ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                        ) : (
                          <Ban className="h-3.5 w-3.5" />
                        )}
                        {row.disabled ? 'Enable' : 'Disable'}
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
        <Modal eyebrow="Reel" title={selected.title} onClose={() => setSelected(null)} wide>
          <ReelDetail reel={selected} />
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onToggle(selected)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              {selected.disabled ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
              ) : (
                <Ban className="h-3.5 w-3.5" />
              )}
              {selected.disabled ? 'Enable' : 'Disable'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(selected.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
