import { useMemo, useState } from 'react'
import { CalendarDays, Eye, MapPin, Trash2 } from 'lucide-react'

import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import {
  deleteRecommendation,
  getRecommendations,
  useAdminStore,
} from '../utils/adminStore'
import { formatMonthYear } from '../utils/format'

const STATUS_VARIANT = {
  published: 'solid',
  pending: 'amber',
  draft: 'slate',
}

function getImage(row) {
  return row.coverImage || row.image || ''
}

function getContentBlocks(row) {
  if (Array.isArray(row.content) && row.content.length) {
    return row.content.filter((block) => block?.heading || block?.value)
  }
  return [
    { heading: 'Why we recommend it', value: row.whyRecommend },
    { heading: 'Market insights', value: row.marketInsights },
    { heading: 'Future prospects', value: row.futureProspects },
  ].filter((block) => block.value)
}

function getSnippet(row) {
  const blocks = getContentBlocks(row)
  if (blocks[0]?.value) return blocks[0].value
  return row.description || ''
}

function RecommendationView({ recommendation }) {
  const image = getImage(recommendation)
  const blocks = getContentBlocks(recommendation)
  const locationLine = [recommendation.location, recommendation.city].filter(Boolean).join(', ')

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl bg-brand-soft">
        {image ? (
          <img src={image} alt="" className="aspect-[16/10] w-full object-cover" />
        ) : (
          <div className="grid aspect-[16/10] place-items-center text-sm font-bold text-brand">
            No image
          </div>
        )}
      </div>

      <div>
        {recommendation.category ? (
          <Badge variant="green">{recommendation.category}</Badge>
        ) : null}
        <h2 className="mt-3 font-display text-2xl font-extrabold text-balance text-slate-900">
          {recommendation.title}
        </h2>
        {recommendation.projectName ? (
          <p className="mt-2 text-sm font-semibold text-slate-500">{recommendation.projectName}</p>
        ) : null}
        {locationLine ? (
          <p className="mt-1 text-sm text-slate-500">{locationLine}</p>
        ) : null}
      </div>

      {blocks.length ? (
        <article className="space-y-8 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          {blocks.map((block, index) => (
            <section
              key={`${block.heading}-${index}`}
              className={index > 0 ? 'border-t border-slate-100 pt-8' : ''}
            >
              <h3 className="font-display text-lg font-bold text-slate-900">{block.heading}</h3>
              <span className="mt-2 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{block.value}</p>
            </section>
          ))}
        </article>
      ) : null}
    </div>
  )
}

function RecommendationCard({ row, onView, onDelete }) {
  const image = getImage(row)
  const snippet = getSnippet(row)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-brand-soft">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm font-bold text-brand">No image</div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2">
          {row.category ? (
            <Badge variant="green" className="bg-white/95">
              {row.category}
            </Badge>
          ) : (
            <span />
          )}
          <Badge variant={STATUS_VARIANT[row.status] || 'slate'}>{row.status}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base leading-snug font-bold text-slate-900 transition group-hover:text-brand">
          {row.title}
        </h3>

        {row.agencyName ? (
          <div className="mt-3 flex items-center gap-2.5">
            {row.agencyAvatar ? (
              <img
                src={row.agencyAvatar}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-soft"
              />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-extrabold text-brand">
                {row.agencyName.slice(0, 1)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-800">{row.agencyName}</p>
            </div>
          </div>
        ) : null}

        {row.projectName ? (
          <p className="mt-3 text-xs font-semibold text-brand">
            Project: <span className="text-slate-700">{row.projectName}</span>
          </p>
        ) : null}

        {(row.city || row.location) && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
            {[row.city, row.location].filter(Boolean).join(' · ')}
          </p>
        )}

        {snippet ? (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{snippet}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            {row.publishedAt ? formatMonthYear(row.publishedAt) : 'Unpublished'}
          </p>
          <div className="relative z-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-soft px-3 py-2 text-xs font-bold text-brand ring-1 ring-brand/15 transition hover:bg-brand hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Recommendations() {
  const tick = useAdminStore()
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => getRecommendations(), [tick])

  function onDelete(id) {
    if (!window.confirm('Delete this recommendation?')) return
    deleteRecommendation(id)
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Recommendations"
        description="Agency recommendations — same fields as the create form. View or delete."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((row) => (
          <RecommendationCard
            key={row.id}
            row={row}
            onView={() => setSelected(row)}
            onDelete={() => onDelete(row.id)}
          />
        ))}
      </div>

      {selected ? (
        <Modal
          wide
          eyebrow="Recommendation"
          title={selected.title}
          onClose={() => setSelected(null)}
        >
          <RecommendationView recommendation={selected} />
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
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
