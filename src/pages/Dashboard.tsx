import { useState } from 'react'
import ExecutiveBrief from '../components/ExecutiveBrief'
import KpiCard from '../components/KpiCard'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import { useBusinessContext } from '../context/BusinessContext'

const quickActions = ['Ask Coach', 'Upload Financials', 'View Analytics', 'Build Action Plan']

const recentActivity = [
  'May P&L reviewed',
  'South Phoenix labor analyzed',
  'July forecast updated',
  'Coach recommendations generated',
]

function Dashboard() {
  const { selectedBranch, currentBusinessContext } = useBusinessContext()
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false)

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedBranch.revenue.currency,
    maximumFractionDigits: 0,
  })

  const formatPercent = (value: number) => {
    const normalizedValue = Math.abs(value) <= 1 ? value * 100 : value
    const roundedValue = Number(normalizedValue.toFixed(2))

    return `${roundedValue % 1 === 0 ? roundedValue.toFixed(0) : roundedValue.toFixed(2)}%`
  }

  const kpis = [
    { label: 'Revenue', value: currencyFormatter.format(selectedBranch.revenue.amount), subtitle: 'Booked revenue to date' },
    {
      label: 'Target',
      value: currencyFormatter.format(selectedBranch.revenueTarget.amount),
      subtitle: 'Current monthly target',
    },
    {
      label: 'Scheduled',
      value: currencyFormatter.format(selectedBranch.scheduledRevenue.amount),
      subtitle: 'Committed scheduled revenue',
    },
    { label: 'Labor', value: formatPercent(selectedBranch.laborPercentage.percent), subtitle: 'Above ideal threshold' },
    { label: 'Retention', value: formatPercent(selectedBranch.retention.percent), subtitle: 'Customer retention this period' },
    {
      label: 'EBITDA',
      value: formatPercent(selectedBranch.ebitda.percent),
      subtitle: `${currencyFormatter.format(selectedBranch.ebitdaDollars.amount)} EBITDA dollars`,
    },
  ]

  const revenueGap = currentBusinessContext.revenueTarget - currentBusinessContext.revenue
  const forecastGap = currentBusinessContext.forecastRevenue - currentBusinessContext.revenueTarget

  const topPriorities = [
    currentBusinessContext.ebitdaPercent < 10
      ? 'Lift EBITDA performance above the 10% operating target.'
      : 'Maintain EBITDA performance above the 10% operating target.',
    currentBusinessContext.laborPercent > 20
      ? 'Reduce labor percentage to improve branch margin discipline.'
      : 'Maintain labor efficiency within target range.',
    revenueGap > 0
      ? `Close the ${currencyFormatter.format(revenueGap)} gap between booked revenue and target.`
      : 'Protect current revenue gains and sustain target attainment.',
  ]

  const executiveBrief = [
    `Revenue vs Target: ${currencyFormatter.format(currentBusinessContext.revenue)} booked against ${currencyFormatter.format(currentBusinessContext.revenueTarget)} target.`,
    `Scheduled Revenue: ${currencyFormatter.format(currentBusinessContext.scheduledRevenue)} is currently in pipeline.`,
    `EBITDA: ${formatPercent(currentBusinessContext.ebitdaPercent)} and ${currencyFormatter.format(currentBusinessContext.ebitdaDollars)} EBITDA dollars with a ${currentBusinessContext.ebitdaPercent < 10 ? 'below-target' : 'healthy'} margin profile.`,
    `Labor %: ${formatPercent(currentBusinessContext.laborPercent)} requiring ${currentBusinessContext.laborPercent > 20 ? 'active management' : 'continued monitoring'}.`,
    `Retention: ${formatPercent(currentBusinessContext.retentionPercent)} customer retention performance.`,
    `Forecast: ${currencyFormatter.format(currentBusinessContext.forecastRevenue)} projected (${forecastGap >= 0 ? 'above' : 'below'} target by ${currencyFormatter.format(Math.abs(forecastGap))}).`,
    'Top 3 priorities:',
    `1. ${topPriorities[0]}`,
    `2. ${topPriorities[1]}`,
    `3. ${topPriorities[2]}`,
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-cyan-500/5">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Good Morning, Travis</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Here is today&apos;s executive brief for Mountain Intelligence.
        </p>
      </section>

      <ExecutiveBrief points={executiveBrief} />

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Current Business Context</p>
          <button
            className="rounded-xl border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 hover:border-cyan-300/40"
            onClick={() => setIsDebugPanelOpen((previous) => !previous)}
            type="button"
          >
            {isDebugPanelOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {isDebugPanelOpen ? (
          <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-xs text-slate-300">
            {JSON.stringify(currentBusinessContext, null, 2)}
          </pre>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} subtitle={kpi.subtitle} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <QuickActions actions={quickActions} />
        <RecentActivity items={recentActivity} />
      </section>
    </div>
  )
}

export default Dashboard
