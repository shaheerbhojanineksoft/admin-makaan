import { useId, useMemo, useState } from 'react'
import { BarChart3 } from 'lucide-react'

import {
  ANALYTICS_ENTITIES,
  ANALYTICS_RANGES,
  buildAnalyticsSeries,
  getEntityLabel,
  getRangeLabel,
} from '../utils/analytics'

const FIELD =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  )
}

function LineBarChart({ points }) {
  const gradientId = useId().replace(/:/g, '')
  const width = 720
  const height = 260
  const padX = 36
  const padY = 28
  const maxValue = Math.max(1, ...points.map((point) => point.value))
  const innerW = width - padX * 2
  const innerH = height - padY * 2
  const gap = points.length > 20 ? 2 : points.length > 12 ? 4 : 8
  const barW = Math.max(6, innerW / points.length - gap)

  const coords = points.map((point, index) => {
    const x = padX + index * (innerW / points.length) + (innerW / points.length - barW) / 2
    const barH = (point.value / maxValue) * innerH
    const y = padY + innerH - barH
    const cx = x + barW / 2
    const cy = y
    return { ...point, x, y, barH, cx, cy }
  })

  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.cx} ${point.cy}`)
    .join(' ')

  const areaPath = coords.length
    ? `${linePath} L ${coords[coords.length - 1].cx} ${padY + innerH} L ${coords[0].cx} ${padY + innerH} Z`
    : ''

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: padY + innerH - ratio * innerH,
    label: Math.round(maxValue * ratio),
  }))

  const labelStep = points.length > 14 ? Math.ceil(points.length / 7) : 1

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-full h-[260px]"
        role="img"
        aria-label="Analytics chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#01411c" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#01411c" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={padX}
              x2={width - padX}
              y1={tick.y}
              y2={tick.y}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-slate-400"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {tick.label}
            </text>
          </g>
        ))}

        {coords.map((point) => (
          <rect
            key={`bar-${point.start}`}
            x={point.x}
            y={point.y}
            width={barW}
            height={Math.max(point.barH, 1)}
            rx="6"
            fill="#01411c"
            fillOpacity="0.18"
          />
        ))}

        {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
        {linePath ? (
          <path d={linePath} fill="none" stroke="#01411c" strokeWidth="2.5" strokeLinejoin="round" />
        ) : null}

        {coords.map((point) => (
          <circle
            key={`dot-${point.start}`}
            cx={point.cx}
            cy={point.cy}
            r="3.5"
            fill="#fff"
            stroke="#01411c"
            strokeWidth="2"
          />
        ))}

        {coords.map((point, index) =>
          index % labelStep === 0 || index === coords.length - 1 ? (
            <text
              key={`label-${point.start}`}
              x={point.cx}
              y={height - 8}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {point.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  )
}

export default function AnalyticsPanel({ tick }) {
  const [entity, setEntity] = useState('listings')
  const [range, setRange] = useState('month')

  const series = useMemo(() => buildAnalyticsSeries(entity, range), [entity, range, tick])

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-brand uppercase">
              Analytics
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-slate-900">
              {getEntityLabel(entity)} · {getRangeLabel(range)}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter by content type and time range to review growth trends.
            </p>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 sm:min-w-[360px]">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              What to view
            </span>
            <select
              className={FIELD}
              value={entity}
              onChange={(event) => setEntity(event.target.value)}
            >
              {ANALYTICS_ENTITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              Time range
            </span>
            <select
              className={FIELD}
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              {ANALYTICS_RANGES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="max-w-xs">
          <Stat label="Total in range" value={series.total} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-brand-soft/40 to-white p-3 sm:p-4">
          <LineBarChart points={series.points} />
        </div>
      </div>
    </section>
  )
}
