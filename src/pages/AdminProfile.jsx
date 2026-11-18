import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

import PageHeader from '../components/ui/PageHeader'
import {
  getAdminProfile,
  updateAdminProfile,
  useAdminStore,
} from '../utils/adminStore'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

export default function AdminProfile() {
  useAdminStore()
  const [form, setForm] = useState(() => getAdminProfile())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(getAdminProfile())
  }, [])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    updateAdminProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      businessHours: form.businessHours.trim(),
    })
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Admin profile"
        description="Your admin contact details shown across support channels."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
      >
        <Field label="Name">
          <input
            className={FIELD}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </Field>
        <Field label="Email">
          <input
            className={FIELD}
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </Field>
        <Field label="Phone">
          <input
            className={FIELD}
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            required
          />
        </Field>
        <Field label="Location">
          <input
            className={FIELD}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            required
          />
        </Field>
        <Field label="Business hours">
          <input
            className={FIELD}
            value={form.businessHours}
            onChange={(e) => set('businessHours', e.target.value)}
            placeholder="Mon–Sat · 9:00 AM – 6:00 PM"
            required
          />
        </Field>

        {saved ? (
          <p className="flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm font-semibold text-brand">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Profile updated.
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          Update details
        </button>
      </form>
    </div>
  )
}
