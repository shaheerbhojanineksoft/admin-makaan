export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
