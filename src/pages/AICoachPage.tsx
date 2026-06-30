import AlertCard from '../components/AlertCard'
import ExecutiveBriefCard from '../components/ExecutiveBriefCard'

const workflows = [
  'Optimize executive messaging for the product launch review',
  'Prepare risk mitigation talking points for the leadership team',
  'Draft a one-page summary for the governance committee',
]

const scenarios = [
  {
    title: 'Operations uplift',
    detail: 'Identify the top three processes to automate before month-end.',
  },
  {
    title: 'Market contingency',
    detail: 'Model the impact of a 12% supply disruption in APAC.',
  },
  {
    title: 'Stakeholder alignment',
    detail: 'Create a concise executive summary for the board chair.',
  },
]

function AICoachPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">AI Coach</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">AI guidance for leadership motion.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Use intelligent coaching to refine plans, anticipate risk, and keep your teams aligned with the highest impact opportunities.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <h3 className="text-xl font-semibold text-white">Recommended workflows</h3>
          <div className="mt-5 space-y-3">
            {workflows.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ExecutiveBriefCard
            title="Scenario planning"
            summary="Assess how a sudden supplier constraint in the next 30 days shifts our capital allocation and enterprise margin targets."
            highlights={['Projected cash buffer of $54M with resiliency steps', 'Short-term risk exposure concentrated in two vendor segments', 'Recommended escalation path for compliance review']}
          />
          <AlertCard
            title="Coach insight"
            message="Accelerate the compliance review with the legal and procurement teams to preserve the Q4 launch window."
            variant="info"
          />
        </div>
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <h3 className="text-xl font-semibold text-white">Scenario summaries</h3>
        <div className="mt-5 space-y-4">
          {scenarios.map((scenario) => (
            <div key={scenario.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{scenario.title}</p>
              <p className="mt-2 text-slate-400">{scenario.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AICoachPage
