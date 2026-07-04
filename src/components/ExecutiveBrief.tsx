interface ExecutiveBriefProps {
  points: string[]
}

function ExecutiveBrief({ points }: ExecutiveBriefProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60 p-6 shadow-2xl shadow-cyan-500/10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Executive Brief</p>
      <ul className="mt-4 space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
          >
            {point}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExecutiveBrief
