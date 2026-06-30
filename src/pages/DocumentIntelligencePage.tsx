import AlertCard from '../components/AlertCard'
import ExecutiveBriefCard from '../components/ExecutiveBriefCard'

const documentStats = [
  { label: 'Contracts reviewed', value: '142', impact: 'Priority clauses validated' },
  { label: 'Policy exceptions', value: '7', impact: 'Requires executive acceptance' },
  { label: 'Action items surfaced', value: '26', impact: 'Assigned to operations leads' },
]

function DocumentIntelligencePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Document Intelligence</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Capture critical signal from every document.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Extract compliance flags, commercial commitments, and negotiation risks for executive review without manual triage.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <h3 className="text-xl font-semibold text-white">Upload and review</h3>
          <div className="mt-5 rounded-[2rem] border border-dashed border-cyan-400/25 bg-slate-950/60 p-8 text-center text-sm text-slate-300">
            <p className="font-semibold text-white">Drag documents here</p>
            <p className="mt-3">PDFs, decks, contracts, and board packages are ingested instantly.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {documentStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-xs text-slate-500">{stat.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ExecutiveBriefCard
            title="Intelligence extraction"
            summary="The platform has automatically surfaced three compliance exceptions and a third-party escalation item for immediate review."
            highlights={['Legal review recommended for contract renewal terms', 'Action item: assign compliance owner for new vendor reviews', 'Summarize governance impact for the next board meeting']}
          />
          <AlertCard
            title="Document signal"
            message="A critical supply agreement clause requires executive sign-off before the 72-hour deadline."
            variant="critical"
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentIntelligencePage
