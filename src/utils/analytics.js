import {
  getAgencies,
  getLawyers,
  getListings,
  getRecommendations,
  getReels,
  getUsers,
} from './adminStore'

export const ANALYTICS_ENTITIES = [
  { value: 'reels', label: 'Reels' },
  { value: 'listings', label: 'Listings' },
  { value: 'users', label: 'Users' },
  { value: 'lawyers', label: 'Lawyers' },
  { value: 'agencies', label: 'Agencies' },
  { value: 'recommendations', label: 'Recommendations' },
]

export const ANALYTICS_RANGES = [
  { value: '24h', label: 'Last 24 hours' },
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: 'year', label: 'Last year' },
  { value: 'all', label: 'All time' },
]

function getRecords(entity) {
  switch (entity) {
    case 'reels':
      return getReels()
    case 'listings':
      return getListings()
    case 'users':
      return getUsers()
    case 'lawyers':
      return getLawyers()
    case 'agencies':
      return getAgencies()
    case 'recommendations':
      return getRecommendations()
    default:
      return []
  }
}

function recordTime(item) {
  const raw = item.createdAt || item.publishedAt || item.updatedAt || item.listedAt
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function startOfHour(ms) {
  const d = new Date(ms)
  d.setMinutes(0, 0, 0)
  return d.getTime()
}

function startOfDay(ms) {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function startOfMonth(ms) {
  const d = new Date(ms)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function hashKey(input) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

function demoActivity(entity, bucketKey, totalRecords) {
  const base = Math.max(1, Math.round(totalRecords * 0.35))
  const wave = hashKey(`${entity}:${bucketKey}`) % 5
  return base + wave
}

function formatBucketLabel(ms, unit) {
  const date = new Date(ms)
  if (unit === 'hour') {
    return new Intl.DateTimeFormat('en-GB', { hour: 'numeric' }).format(date)
  }
  if (unit === 'month') {
    return new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date)
  }
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date)
}

function buildBuckets(range, now = Date.now()) {
  if (range === '24h') {
    const end = startOfHour(now)
    return Array.from({ length: 24 }, (_, index) => {
      const start = end - (23 - index) * 60 * 60 * 1000
      return { start, end: start + 60 * 60 * 1000, unit: 'hour', key: `h-${start}` }
    })
  }

  if (range === 'week') {
    const end = startOfDay(now)
    return Array.from({ length: 7 }, (_, index) => {
      const start = end - (6 - index) * 24 * 60 * 60 * 1000
      return { start, end: start + 24 * 60 * 60 * 1000, unit: 'day', key: `d-${start}` }
    })
  }

  if (range === 'month') {
    const end = startOfDay(now)
    return Array.from({ length: 30 }, (_, index) => {
      const start = end - (29 - index) * 24 * 60 * 60 * 1000
      return { start, end: start + 24 * 60 * 60 * 1000, unit: 'day', key: `d-${start}` }
    })
  }

  if (range === 'year') {
    const end = startOfMonth(now)
    return Array.from({ length: 12 }, (_, index) => {
      const startDate = new Date(end)
      startDate.setMonth(startDate.getMonth() - (11 - index))
      const start = startOfMonth(startDate.getTime())
      const next = new Date(start)
      next.setMonth(next.getMonth() + 1)
      return { start, end: next.getTime(), unit: 'month', key: `m-${start}` }
    })
  }

  // all time — last 12 months window for readable chart
  const end = startOfMonth(now)
  return Array.from({ length: 12 }, (_, index) => {
    const startDate = new Date(end)
    startDate.setMonth(startDate.getMonth() - (11 - index))
    const start = startOfMonth(startDate.getTime())
    const next = new Date(start)
    next.setMonth(next.getMonth() + 1)
    return { start, end: next.getTime(), unit: 'month', key: `m-${start}` }
  })
}

function rangeWindow(range, buckets, now = Date.now()) {
  if (range === 'all') return { from: 0, to: now }
  if (!buckets.length) return { from: now, to: now }
  return { from: buckets[0].start, to: now }
}

/**
 * Build analytics points for dashboard chart.
 * Uses real createdAt timestamps, with light demo activity so short ranges stay readable.
 */
export function buildAnalyticsSeries(entity, range) {
  const records = getRecords(entity)
  const buckets = buildBuckets(range)
  const { from, to } = rangeWindow(range, buckets)
  const times = records.map(recordTime).filter((value) => value != null)
  const inRange = times.filter((time) => time >= from && time <= to)

  const points = buckets.map((bucket) => {
    const real = times.filter((time) => time >= bucket.start && time < bucket.end).length
    const demo = demoActivity(entity, bucket.key, records.length)
    // Prefer real counts; blend a bit of demo so sparse seed still charts well
    const value = real > 0 ? real + Math.floor(demo / 3) : Math.max(0, Math.floor(demo * 0.6))
    return {
      label: formatBucketLabel(bucket.start, bucket.unit),
      value,
      real,
      start: bucket.start,
      end: bucket.end,
    }
  })

  const total = points.reduce((sum, point) => sum + point.value, 0)

  return {
    entity,
    range,
    points,
    total,
    recordCount: records.length,
    matchedCount: inRange.length,
  }
}

export function getEntityLabel(value) {
  return ANALYTICS_ENTITIES.find((item) => item.value === value)?.label || value
}

export function getRangeLabel(value) {
  return ANALYTICS_RANGES.find((item) => item.value === value)?.label || value
}
