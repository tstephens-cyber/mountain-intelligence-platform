const workspaceCards = [
  {
    title: 'Action Center',
    detail: 'Track leadership actions, assign owners, and monitor completion velocity.',
  },
  {
    title: 'Knowledge Base',
    detail: 'Centralize SOPs, operational context, and decision history for every branch.',
  },
  {
    title: 'Team Alignment',
    detail: 'Keep strategic objectives visible across operations, finance, and executive staff.',
  },
]

function WorkspacePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Workspace</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Operate from one executive workspace.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Coordinate initiatives, decisions, and accountability across the Mountain Intelligence platform.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {workspaceCards.map((card) => (
          <article key={card.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{card.detail}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default WorkspacePage
