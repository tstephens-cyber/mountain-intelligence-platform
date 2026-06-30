import AlertCard from '../components/AlertCard'

const trendData = [
  { label: 'Revenue growth', value: '14.8%', color: 'from-cyan-500 to-blue-500' },
  { label: 'Retention index', value: '91%', color: 'from-emerald-500 to-cyan-500' },
  { label: 'Risk signal coverage', value: '98%', color: 'from-violet-500 to-fuchsia-500' },
]

const regions = [
  { region: 'North America', percent: 87 },
  { region: 'EMEA', percent: 72 },
  { region: 'APAC', percent: 81 },
]

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Analytics</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Signal clarity for executive action.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Analyze performance patterns and surface the insights that matter most for the next operating cycle.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Performance trend</p>
              <h3 className="text-xl font-semibold text-white">Forecast vs actual</h3>
            </div>
            <p className="text-sm text-emerald-300">Report updated 8 min ago</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {trendData.map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {regions.map((region) => (
              <div key={region.region} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{region.region}</span>
                  <span>{region.percent}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${region.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <AlertCard
            title="Operational pulse"
            message="Current system health is strong, but supply chain signals require a mid-quarter vendor check-in."
            variant="info"
          />
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Insights</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Analytics snapshot</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li>Revenue forecast variance improved by 3.4% compared to last month.</li>
              <li>Compliance exceptions have decreased after process automation.</li>
              <li>Board influence score rose with stronger cross-functional alignment.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
