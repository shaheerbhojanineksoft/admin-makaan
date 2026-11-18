import { useEffect, useMemo, useState } from 'react'
import {
  Ban,
  Bath,
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Maximize,
  Trash2,
  X,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import {
  deleteListing,
  getListings,
  setListingDisabled,
  useAdminStore,
} from '../utils/adminStore'
import { formatPKR } from '../utils/format'

const PROPERTY_TYPE_LABELS = {
  bungalow: 'Bungalow',
  apartment: 'Apartment',
  penthouse: 'Penthouse',
  duplex: 'Duplex',
  studio_apartment: 'Studio Apartment',
  shop: 'Shop',
  office: 'Office',
  portion: 'Portion',
  farmhouse: 'Farmhouse',
  building: 'Building',
  plot: 'Plot',
}

const SIZE_AREA_LABELS = {
  marla: 'Marla',
  kanal: 'Kanal',
  sq: 'Sq',
}

function propertyTypeLabel(value) {
  if (!value) return ''
  return PROPERTY_TYPE_LABELS[value] || value
}

function formatSizeLabel(size) {
  if (!size) return ''
  if (typeof size === 'string') return size
  const area = SIZE_AREA_LABELS[size.area] || size.area || ''
  const unit = size.unit ?? ''
  return `${unit} ${area}`.trim()
}

function getListingImages(listing) {
  if (!listing) return []
  const fromGallery = Array.isArray(listing.images) ? listing.images.filter(Boolean) : []
  const cover = listing.image
  return [...(cover ? [cover] : []), ...fromGallery].filter(
    (url, index, list) => list.indexOf(url) === index,
  )
}

function DetailItem({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function ListingImageSwiper({ images }) {
  const slides = images.length ? images : []
  const [index, setIndex] = useState(0)
  const total = slides.length
  const current = slides[Math.min(index, Math.max(total - 1, 0))] || ''

  useEffect(() => {
    setIndex(0)
  }, [total, slides[0]])

  if (!total) {
    return <div className="aspect-[16/9] bg-brand-soft" />
  }

  function go(delta) {
    setIndex((value) => (value + delta + total) % total)
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-brand-soft">
      <img
        key={current}
        src={current}
        alt=""
        className="h-full w-full object-cover transition duration-300"
      />

      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand shadow-md transition hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand shadow-md transition hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((url, slideIndex) => (
              <button
                key={`${url}-${slideIndex}`}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Go to image ${slideIndex + 1}`}
                className={`h-2 rounded-full transition ${
                  slideIndex === index ? 'w-5 bg-white' : 'w-2 bg-white/55 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <span className="absolute right-14 bottom-3 rounded-full bg-slate-900/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            {index + 1} / {total}
          </span>
        </>
      ) : null}
    </div>
  )
}

/** Same fields / layout as agency listing detail (`/agency/listings`). */
function ListingDetailModal({ listing, onClose, onToggle, onDelete }) {
  const isDisabled = Boolean(listing.disabled)
  const isPlot =
    listing.kind === 'plot' || String(listing.propertyType || '').toLowerCase().includes('plot')
  const images = useMemo(() => getListingImages(listing), [listing])
  const purpose = listing.purpose === 'rent' ? 'Rent' : 'Buy'
  const sizeLabel = formatSizeLabel(listing.size) || listing.area || ''

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-listing-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close listing details"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="relative">
          <ListingImageSwiper images={images} />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-600 shadow-sm transition hover:bg-white hover:text-brand"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-extrabold text-white uppercase">
              {listing.purpose === 'rent' ? 'For Rent' : 'For Buy'}
            </span>
            <span
              className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold ${
                isDisabled ? 'bg-slate-200 text-slate-600' : 'bg-white text-brand'
              }`}
            >
              {isDisabled ? 'Disabled' : 'Active'}
            </span>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">
              {isPlot ? 'Plot' : 'Property'} ·{' '}
              {propertyTypeLabel(listing.propertyType) || listing.propertyType || (isPlot ? 'Plot' : '')}
            </p>
            <h2
              id="admin-listing-detail-title"
              className="mt-1.5 font-display text-3xl font-extrabold text-slate-900"
            >
              {listing.title}
            </h2>
            {listing.projectName ? (
              <p className="mt-1.5 text-base font-semibold text-slate-500">{listing.projectName}</p>
            ) : null}
            <p className="mt-2.5 flex items-center gap-1.5 text-base font-medium text-slate-500">
              <MapPin className="h-5 w-5 shrink-0 text-brand" />
              {listing.location}
              {listing.city ? `, ${listing.city}` : ''}
            </p>
            <p className="mt-3 font-display text-3xl font-extrabold text-brand">
              {formatPKR(listing.price)}
              {listing.purpose === 'rent' ? (
                <span className="text-base font-bold text-slate-400"> /month</span>
              ) : null}
            </p>
          </div>

          {/* Same detail keys as agency create form */}
          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2">
            <DetailItem label="Listing category" value={isPlot ? 'Plot' : 'Property'} />
            <DetailItem label="Title" value={listing.title} />
            {!isPlot ? <DetailItem label="Project name" value={listing.projectName} /> : null}
            <DetailItem label="Location" value={listing.location} />
            <DetailItem label="City" value={listing.city} />
            <DetailItem
              label="Property type"
              value={propertyTypeLabel(listing.propertyType) || (isPlot ? 'Plot' : '')}
            />
            <DetailItem label="Purpose" value={purpose} />
            <DetailItem label="Price" value={formatPKR(listing.price)} />
            <DetailItem label="Size" value={sizeLabel} />

            {!isPlot ? (
              <>
                <DetailItem
                  label="Bedrooms"
                  value={
                    listing.bedrooms != null || listing.beds != null
                      ? String(listing.bedrooms ?? listing.beds)
                      : ''
                  }
                />
                <DetailItem
                  label="Bathrooms"
                  value={
                    listing.bathrooms != null || listing.baths != null
                      ? String(listing.bathrooms ?? listing.baths)
                      : ''
                  }
                />
                <DetailItem
                  label="Parking"
                  value={listing.parking != null && listing.parking !== '' ? String(listing.parking) : ''}
                />
                <DetailItem
                  label="Amenities"
                  value={
                    Array.isArray(listing.amenities)
                      ? listing.amenities.join(', ')
                      : listing.amenities
                  }
                />
              </>
            ) : (
              <>
                <DetailItem label="Plot no" value={listing.plotNo || listing.plotNumber} />
                <DetailItem label="Dimensions" value={listing.dimensions} />
                <DetailItem label="Ownership" value={listing.ownership} />
                <DetailItem
                  label="Possession ready"
                  value={
                    listing.possession === true
                      ? 'Yes'
                      : listing.possession === false
                        ? 'No'
                        : listing.possession || ''
                  }
                />
              </>
            )}
          </div>

          {!isPlot &&
          ((listing.bedrooms ?? listing.beds) > 0 || (listing.bathrooms ?? listing.baths) > 0) ? (
            <div className="flex flex-wrap gap-4 text-base font-semibold text-slate-600">
              {(listing.bedrooms ?? listing.beds) > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-5 w-5 text-brand" />
                  {listing.bedrooms ?? listing.beds} Beds
                </span>
              ) : null}
              {(listing.bathrooms ?? listing.baths) > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-5 w-5 text-brand" />
                  {listing.bathrooms ?? listing.baths} Baths
                </span>
              ) : null}
              {sizeLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <Maximize className="h-5 w-5 text-brand" />
                  {sizeLabel}
                </span>
              ) : null}
            </div>
          ) : null}

          {Array.isArray(listing.highlights) && listing.highlights.length > 0 ? (
            <div>
              <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                Highlights
              </p>
              <ul className="mt-2.5 space-y-2">
                {listing.highlights.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-base text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {listing.about || listing.description ? (
            <div>
              <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                {isPlot ? 'About this plot' : 'About this property'}
              </p>
              <p className="mt-2.5 text-base leading-relaxed text-slate-600">
                {listing.about || listing.description}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onToggle(listing)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-base font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {isDisabled ? (
                <CheckCircle2 className="h-5 w-5 text-brand" />
              ) : (
                <Ban className="h-5 w-5" />
              )}
              {isDisabled ? 'Enable' : 'Disable'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(listing.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2.5 text-base font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 className="h-5 w-5" />
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-base font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Listings() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => getListings(), [tick])

  function onDelete(id) {
    if (!window.confirm('Delete this listing?')) return
    deleteListing(id)
    if (selected?.id === id) setSelected(null)
  }

  function onToggle(row) {
    const next = !row.disabled
    if (
      !window.confirm(
        next ? 'Disable this listing on the public site?' : 'Enable this listing again?',
      )
    ) {
      return
    }
    setListingDisabled(row.id, next)
    if (selected?.id === row.id) setSelected({ ...row, disabled: next })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Listings"
        description="Agency property & plot listings — same form details as /agency/listings/new."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Listing</th>
                <th className="px-4 py-3.5">Agency</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Price</th>
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
                      {getListingImages(row)[0] ? (
                        <img
                          src={getListingImages(row)[0]}
                          alt=""
                          className="h-12 w-16 rounded-lg bg-brand-soft object-cover"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">{row.title}</p>
                        {row.location ? (
                          <p className="truncate text-xs text-slate-500">{row.location}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.agencyName}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.kind === 'plot' ? 'Plot' : 'Property'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.city}</td>
                  <td className="px-4 py-3 font-bold text-brand">{formatPKR(row.price)}</td>
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
        <ListingDetailModal
          listing={selected}
          onClose={() => setSelected(null)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  )
}
