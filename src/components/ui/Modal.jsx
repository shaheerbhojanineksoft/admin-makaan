import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  title,
  eyebrow,
  onClose,
  children,
  wide,
  extraWide,
  flush,
}) {
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

  const widthClass = extraWide ? 'max-w-5xl' : wide ? 'max-w-3xl' : 'max-w-xl'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl ${widthClass}`}
      >
        {flush ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-20 grid h-9 w-9 place-items-center rounded-xl border border-white/40 bg-white/95 text-slate-700 shadow-sm transition hover:bg-white hover:text-brand"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="text-[11px] font-extrabold tracking-[0.14em] text-brand uppercase">
                    {eyebrow}
                  </p>
                ) : null}
                <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-brand"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
          </>
        )}
      </div>
    </div>
  )
}
