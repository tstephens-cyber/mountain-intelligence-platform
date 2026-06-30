interface TopNavigationProps {
  title?: string
  description?: string
}

function TopNavigation({
  title = 'Decision-ready intelligence',
  description = 'Bring clarity to the team with a modern executive command center.',
}: TopNavigationProps) {
  return (
    <header className="border-b border-white/10 bg-slate-900/70 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Mountain AI</p>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-400">
            <span>⌕</span>
            <input
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
              placeholder="Search workspace"
              aria-label="Search workspace"
            />
          </label>
          <button className="rounded-2xl bg-cyan-500/20 px-3 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/25">
            Sync status
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavigation
