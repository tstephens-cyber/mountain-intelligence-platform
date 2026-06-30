interface KpiCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  description: string
}

function KpiCard({ label, value, change, trend, description }: KpiCardProps) {
  const trendClass = trend === 'up' ? 'text-emerald-300' : 'text-rose-300'
  const arrow = trend === 'up' ? '▲' : '▼'

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-cyan-500/5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className={`mt-2 text-sm font-semibold ${trendClass}`}>
        {arrow} {change}
      </p>
      <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  )
}

export default KpiCard
