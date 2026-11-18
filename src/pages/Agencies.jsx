import { useMemo, useState } from 'react'
import {
  Award,
  BadgeCheck,
  Ban,
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Eye,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Trash2,
  Users,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import {
  deleteAgency,
  getAgencies,
  setAgencyStatus,
  useAdminStore,
} from '../utils/adminStore'

function isAgencyActive(agency) {
  return agency?.status !== 'inactive'
}

function StatTile({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
      <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-2.5 font-display text-xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
    </div>
  )
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6">
      <h3 className="flex items-center gap-3 font-display text-base font-bold text-slate-900">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ChipList({ items }) {
  if (!Array.isArray(items) || !items.length) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/15"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function DetailItem({ icon: Icon, label, value }) {
  if (value == null || value === '') return null
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
        <p className="mt-0.5 text-sm font-semibold break-words text-slate-800">{value}</p>
      </div>
    </li>
  )
}

function AgencyProfileView({ agency }) {
  const services = agency.services?.length ? agency.services : []
  const languages = Array.isArray(agency.languages) ? agency.languages.join(', ') : agency.languages

  return (
    <div className="bg-offwhite">
      {/* Cover + identity — mirrors Makaan AgentProfile */}
      <section className="relative isolate">
        <div className="relative h-48 w-full bg-brand sm:h-56">
          <div className="absolute inset-0 overflow-hidden">
            {agency.coverImage ? (
              <img src={agency.coverImage} alt="" className="h-full w-full object-cover" />
            ) : null}
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand via-brand/50 to-brand/10"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="relative z-10 -mt-12 flex flex-col items-center gap-4 px-5 text-center sm:-mt-14 sm:flex-row sm:items-end sm:px-7 sm:text-left">
          <img
            src={agency.avatar}
            alt=""
            className="h-24 w-24 rounded-2xl border-4 border-white bg-brand-soft object-cover shadow-lg sm:h-28 sm:w-28"
          />
          <div className="pb-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                {agency.contactPerson}
              </h2>
              {agency.verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold text-brand ring-1 ring-brand/15">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Verified
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-semibold text-brand">{agency.name}</p>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                {agency.city}, Pakistan
              </span>
              {agency.rating != null ? (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {agency.rating} rating
                  {agency.reviews != null ? ` · ${agency.reviews} reviews` : ''}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-3 gap-3 px-5 sm:px-7">
        <StatTile
          icon={Briefcase}
          value={`${agency.experienceYears ?? 0} yrs`}
          label="Experience"
        />
        <StatTile
          icon={Building2}
          value={agency.activeListings ?? agency.listingsCount ?? 0}
          label="Active Listings"
        />
        <StatTile icon={Users} value={agency.teamSize ?? 0} label="Team Members" />
      </div>

      <div className="grid gap-5 px-5 py-6 sm:px-7 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <InfoSection icon={Building2} title="About the Agency">
            <p className="text-sm leading-relaxed text-slate-600">
              {agency.bio || 'No bio provided.'}
            </p>
          </InfoSection>

          <InfoSection icon={Compass} title="Specializations">
            <ChipList items={agency.specializations} />
          </InfoSection>

          <InfoSection icon={ShieldCheck} title="Services Offered">
            {services.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No services listed.</p>
            )}
          </InfoSection>

          <InfoSection icon={MapPin} title="Areas Served">
            <ChipList items={agency.areasServed} />
          </InfoSection>
        </div>

        <aside className="space-y-5">
          <InfoSection icon={ShieldCheck} title="Agency Details">
            <ul className="space-y-4">
              <DetailItem icon={Award} label="Licence Number" value={agency.licenseNumber} />
              <DetailItem icon={MapPin} label="Office Address" value={agency.officeAddress} />
              <DetailItem icon={Clock3} label="Typical Response" value={agency.responseTime} />
              <DetailItem
                icon={CalendarCheck}
                label="Member Since"
                value={agency.memberSince ? String(agency.memberSince) : ''}
              />
              <DetailItem icon={Languages} label="Languages" value={languages} />
              <DetailItem icon={Phone} label="Phone" value={agency.phone} />
              <DetailItem icon={Mail} label="Email" value={agency.email} />
            </ul>
          </InfoSection>
        </aside>
      </div>
    </div>
  )
}

export default function Agencies() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => getAgencies(), [tick])

  function onDelete(id) {
    if (!window.confirm('Delete this agency?')) return
    deleteAgency(id)
    if (selected?.id === id) setSelected(null)
  }

  function onToggleActive(row) {
    const nextActive = !isAgencyActive(row)
    if (
      !window.confirm(
        nextActive
          ? 'Enable this agency again?'
          : 'Disable this agency on the public site?',
      )
    ) {
      return
    }
    const nextStatus = nextActive ? 'active' : 'inactive'
    setAgencyStatus(row.id, nextStatus)
    if (selected?.id === row.id) setSelected({ ...row, status: nextStatus })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Partners"
        title="Agencies"
        description="All registered agencies — view, enable/disable, or delete."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Agency</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Listings</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const active = isAgencyActive(row)
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/80 ${active ? '' : 'opacity-75'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {row.avatar ? (
                          <img
                            src={row.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-brand/15"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.contactPerson}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.city}</td>
                    <td className="px-4 py-3 text-slate-600">{row.phone}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {row.activeListings ?? row.listingsCount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={active ? 'green' : 'slate'}>
                        {active ? 'Active' : 'Disabled'}
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
                          onClick={() => onToggleActive(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          {active ? (
                            <Ban className="h-3.5 w-3.5" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                          )}
                          {active ? 'Disable' : 'Enable'}
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <Modal flush extraWide onClose={() => setSelected(null)}>
          <AgencyProfileView agency={selected} />
          <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={() => onToggleActive(selected)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              {isAgencyActive(selected) ? (
                <Ban className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
              )}
              {isAgencyActive(selected) ? 'Disable' : 'Enable'}
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
