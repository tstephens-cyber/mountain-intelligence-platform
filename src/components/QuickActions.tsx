interface QuickActionsProps {
  actions: string[]
}

function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Actions</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action}
            className="rounded-2xl border border-white/10 bg-cyan-500/10 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-500/20"
            type="button"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
