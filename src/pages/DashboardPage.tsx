import AlertCard from '../components/AlertCard'
import ExecutiveBriefCard from '../components/ExecutiveBriefCard'
import KpiCard from '../components/KpiCard'

const kpis: Array<{
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  description: string
}> = [
  {
    label: 'Operational confidence',
    value: '92%',
    change: '+5.4%',
    trend: 'up',
    description: 'Cross-functional teams are aligned on automation targets for the quarter.',
  },
  {
    label: 'Forecast accuracy',
    value: '87%',
    change: '+2.1%',
    trend: 'up',
    description: 'Demand and risk forecast accuracy remains within executive tolerance.',
  },
  {
    label: 'Compliance coverage',
    value: '98%',
    change: '+1.8%',
    trend: 'up',
    description: 'Policy monitoring is tracking all active regional operations.',
  },
  {
    label: 'Signal latency',
    value: '1.1s',
    change: '-12%',
    trend: 'down',
    description: 'Real-time alert latency is improving against the baseline.',
  },
]

const activity = [
  {
    title: 'Risk profile updated',
    detail: 'Corporate risk score for EMEA logistics adjusted after vendor review.',
  },
  {
    title: 'Executive brief published',
    detail: 'Board-ready summary delivered for the upcoming strategy session.',
  },
  {
    title: 'KPI target refreshed',
    detail: 'Q3 margin projections aligned with the latest resource plan.',
  },
]

const quickActions = [
  'Approve operational playbook',
  'Assign incident review',
  'Confirm board agenda',
  'Authorize partner diligence',
]

function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/80 p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Welcome back, executive leader</p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Mountain Intelligence is ready for your next decision.</h2>
            <p className="mt-4 text-sm text-slate-300 sm:text-base">
              See operational health, risk signals, and high-priority actions in one executive command center.
            </p>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-4 text-sm text-cyan-100">
            <p className="font-semibold">Board readiness</p>
            <p className="mt-1 text-slate-200">14 items cleared · Next check-in 08:45 UTC</p>
          </div>
        </div>
      </section>

      <ExecutiveBriefCard
        title="Strategic operations brief"
        summary="Prioritize supplier continuity, secure margin expansion in APAC, and validate the next wave of AI-driven orchestration for finance and logistics."
        highlights={[
          'Revenue guidance on pace for $2.1B annual run rate',
          'Regional risk corridor stable across North America and EMEA',
          'Immediate action: accelerate compliance validation for cloud contracts',
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Recent activity</p>
              <h3 className="text-xl font-semibold text-white">Operational milestones</h3>
            </div>
            <span className="text-sm text-emerald-300">Updated 12 minutes ago</span>
          </div>
          <div className="mt-6 space-y-4">
            {activity.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Quick actions</p>
              <h3 className="text-xl font-semibold text-white">Take action now</h3>
            </div>
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Priority
            </span>
          </div>
          <div className="mt-6 grid gap-3">
            {quickActions.map((action) => (
              <button
                key={action}
                className="rounded-3xl border border-white/10 bg-cyan-500/10 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/15"
              >
                {action}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <AlertCard
              title="Elevated vendor risk"
              message="Review the three highest impact contracts before the end of day to protect the delivery pipeline."
              variant="warning"
            />
            <AlertCard
              title="Pipeline signal"
              message="Pipeline health for emerging markets is strong, with two new partner approvals underway."
              variant="info"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
