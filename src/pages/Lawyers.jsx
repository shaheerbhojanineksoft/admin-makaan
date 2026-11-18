import { useMemo, useState } from 'react'
import { Eye, Trash2, UserRound } from 'lucide-react'

import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import { deleteLawyer, getLawyers, useAdminStore } from '../utils/adminStore'

function Detail({ label, value }) {
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
 * Same fields a lawyer fills on Lawyer Profile:
 * Profile picture, Full name, Location, Specialist in, Bio,
 * Phone number for calling, Phone number for WhatsApp.
 */
function LawyerProfileView({ lawyer }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-brand-soft ring-2 ring-brand/15">
          {lawyer.avatar ? (
            <img src={lawyer.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-brand">
              <UserRound className="h-8 w-8" />
            </div>
          )}
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            Profile picture
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Detail label="Full name" value={lawyer.name} />
        <Detail label="Location" value={lawyer.city} />
        <Detail label="Specialist in" value={lawyer.specialty} />
        <Detail label="Bio" value={lawyer.bio} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Detail label="Phone number for calling" value={lawyer.phone} />
        <Detail label="Phone number for WhatsApp" value={lawyer.whatsapp} />
      </div>
    </div>
  )
}

export default function Lawyers() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => getLawyers(), [tick])

  function onDelete(id) {
    if (!window.confirm('Delete this lawyer?')) return
    deleteLawyer(id)
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Legal"
        title="Lawyers"
        description="Profiles lawyers submit — same fields as Lawyer Profile."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Full name</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Specialist in</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-soft">
                        {row.avatar ? (
                          <img src={row.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-brand">
                            <UserRound className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.city || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.specialty || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.phone || '—'}</td>
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
        <Modal
          wide
          eyebrow="Lawyer profile"
          title={selected.name || 'Lawyer'}
          onClose={() => setSelected(null)}
        >
          <LawyerProfileView lawyer={selected} />
        </Modal>
      ) : null}
    </div>
  )
}
