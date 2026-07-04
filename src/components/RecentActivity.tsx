interface RecentActivityProps {
  items: string[]
}

function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Recent Activity</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentActivity
