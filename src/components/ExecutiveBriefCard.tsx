interface ExecutiveBriefCardProps {
  title: string
  summary: string
  highlights: string[]
}

function ExecutiveBriefCard({ title, summary, highlights }: ExecutiveBriefCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{title}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Priority brief</div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{summary}</p>
      <div className="mt-6 space-y-3">
        {highlights.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExecutiveBriefCard
