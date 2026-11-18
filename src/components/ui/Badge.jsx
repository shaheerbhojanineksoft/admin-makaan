const VARIANTS = {
  green: 'bg-brand-soft text-brand ring-1 ring-brand/15',
  solid: 'bg-brand text-white ring-1 ring-brand',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  slate: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
}

export default function Badge({ children, variant = 'green', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${VARIANTS[variant] ?? VARIANTS.green} ${className}`}
    >
      {children}
    </span>
  )
}
