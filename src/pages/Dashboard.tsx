import ExecutiveBrief from '../components/ExecutiveBrief'
import KpiCard from '../components/KpiCard'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import { useBusinessContext } from '../context/BusinessContext'

const executiveBrief = [
  'Revenue is currently $207,024 booked against a $357,744 target.',
  'Scheduled revenue is $183,178.',
  'South Phoenix EBITDA is below the 10% goal.',
  'Labor cost needs attention.',
]

const quickActions = ['Ask Coach', 'Upload Financials', 'View Analytics', 'Build Action Plan']

const recentActivity = [
  'May P&L reviewed',
  'South Phoenix labor analyzed',
  'July forecast updated',
  'Coach recommendations generated',
]

function Dashboard() {
  const { selectedBranch } = useBusinessContext()

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedBranch.revenue.currency,
    maximumFractionDigits: 0,
  })

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
    { label: 'Labor', value: `${selectedBranch.laborPercentage.percent}%`, subtitle: 'Above ideal threshold' },
    { label: 'Retention', value: `${selectedBranch.retention.percent}%`, subtitle: 'Customer retention this period' },
    { label: 'EBITDA', value: `${selectedBranch.ebitda.percent}%`, subtitle: 'Below 10% operating goal' },
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
