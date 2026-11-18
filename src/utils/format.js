export function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function formatMonthYear(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  } catch {
    return value
  }
}

export function formatPKR(amount) {
  if (amount == null || amount === '') return '—'
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(Number(amount))
  } catch {
    return `PKR ${amount}`
  }
}
