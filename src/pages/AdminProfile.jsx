import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

import PageHeader from '../components/ui/PageHeader'
import Toast from '../components/ui/Toast'
import { adminApi } from '../utils/api'
import {
  displayOrDash,
  updateSessionAdmin,
  useAdminSession,
} from '../utils/session'

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

function toFormValue(value) {
  return displayOrDash(value, '-')
}

function fromFormValue(value) {
  const text = (value ?? '').toString().trim()
  if (!text || text === '-') return ''
  return text
}

const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]*[0-9]$/

function isValidPhone(value) {
  const phone = fromFormValue(value)
  if (!phone) return false
  if (!PHONE_PATTERN.test(phone)) return false
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

function sanitizePhoneInput(value) {
  return value.replace(/[^\d+\-\s()]/g, '')
}

function buildForm(admin = {}) {
  return {
    name: toFormValue(admin.name),
    email: toFormValue(admin.email),
    phone: toFormValue(admin.phone),
    location: toFormValue(admin.location),
    businessOpensAt: toFormValue(admin.businessOpensAt),
    businessCloseAt: toFormValue(admin.businessCloseAt),
  }
}

export default function AdminProfile() {
  const session = useAdminSession()
  const [form, setForm] = useState(() => buildForm(session.admin))
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVariant, setToastVariant] = useState('error')

  const clearToast = useCallback(() => setToast(''), [])

  const adminKey = JSON.stringify(session.admin || {})

  useEffect(() => {
    setForm(buildForm(JSON.parse(adminKey)))
    setSaved(false)
  }, [adminKey])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: fromFormValue(form.name),
      phone: fromFormValue(form.phone),
      location: fromFormValue(form.location),
      businessOpensAt: fromFormValue(form.businessOpensAt),
      businessCloseAt: fromFormValue(form.businessCloseAt),
    }

    if (Object.values(payload).some((value) => !value)) {
      setToastVariant('error')
      setToast('All fields are required.')
      return
    }

    if (!isValidPhone(payload.phone)) {
      setToastVariant('error')
      setToast('Enter a valid phone number (digits only).')
      return
    }

    setLoading(true)
    setToast('')
    setSaved(false)

    try {
      const updated = await adminApi('/admin/profile', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
      })
      updateSessionAdmin(updated || payload)
      setForm(buildForm(updated || payload))
      setSaved(true)
      setToastVariant('success')
      setToast('Profile updated successfully.')
    } catch (err) {
      setToastVariant('error')
      setToast(err?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Toast
        open={Boolean(toast)}
        message={toast}
        variant={toastVariant}
        duration={3000}
        onClose={clearToast}
      />

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
            className={`${FIELD} cursor-not-allowed bg-slate-50 text-slate-500`}
            type="email"
            value={form.email}
            disabled
            readOnly
          />
        </Field>
        <Field label="Phone">
          <input
            className={FIELD}
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set('phone', sanitizePhoneInput(e.target.value))}
            placeholder="03XXXXXXXXX"
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business opens at (HH:mm)">
            <input
              className={FIELD}
              value={form.businessOpensAt}
              onChange={(e) => set('businessOpensAt', e.target.value)}
              placeholder="09:00"
              required
            />
          </Field>
          <Field label="Business closes at (HH:mm)">
            <input
              className={FIELD}
              value={form.businessCloseAt}
              onChange={(e) => set('businessCloseAt', e.target.value)}
              placeholder="18:00"
              required
            />
          </Field>
        </div>

        {saved ? (
          <p className="flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm font-semibold text-brand">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Profile updated.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || Boolean(toast)}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Updating…' : 'Update details'}
        </button>
      </form>
    </div>
  )
}
