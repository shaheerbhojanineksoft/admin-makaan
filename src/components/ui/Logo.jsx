/**
 * Brand lockup — same Makaan mark as the main app.
 */
export default function Logo({ variant = 'light', className = '' }) {
  const isLight = variant === 'light'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-lg sm:h-12 sm:w-12 ${
          isLight
            ? 'bg-brand text-white shadow-brand/25'
            : 'bg-white text-brand shadow-brand-dark/30'
        }`}
      >
        <svg viewBox="0 0 40 40" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" fill="none">
          <path
            d="M7 19.5 L20 8.5 L33 19.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 18.5 V31.5 H29.5 V18.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 31.5 V23.5 H22.5 V31.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26.5" cy="23.5" r="1.5" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`font-display block text-xl font-extrabold tracking-tight sm:text-2xl ${
            isLight ? 'text-brand' : 'text-white'
          }`}
        >
          Makaan
        </span>
        <span
          className={`mt-1 block text-[10px] font-bold tracking-[0.28em] uppercase ${
            isLight ? 'text-brand-light' : 'text-brand-soft/75'
          }`}
        >
          Admin Panel
        </span>
      </span>
    </div>
  )
}
