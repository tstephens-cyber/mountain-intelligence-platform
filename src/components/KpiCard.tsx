interface KpiCardProps {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  description?: string
  subtitle?: string
}

function KpiCard({ label, value, change, trend, description, subtitle }: KpiCardProps) {
  const hasTrend = Boolean(change && trend)
  const trendClass = trend === 'up' ? 'text-emerald-300' : 'text-rose-300'
  const arrow = trend === 'up' ? '▲' : '▼'
  const footerText = subtitle ?? description

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {hasTrend ? (
        <p className={`mt-2 text-sm font-semibold ${trendClass}`}>
          {arrow} {change}
        </p>
      ) : null}
      {footerText ? <p className="mt-4 text-sm leading-6 text-slate-300">{footerText}</p> : null}
    </div>
  )
}

export default KpiCard
