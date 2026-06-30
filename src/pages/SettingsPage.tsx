const settings = [
  {
    category: 'Workspace preferences',
    items: [
      { label: 'Notifications', value: 'Enabled' },
      { label: 'Theme', value: 'Executive Dark' },
      { label: 'Auto-sync', value: 'On' },
    ],
  },
  {
    category: 'Security and governance',
    items: [
      { label: 'SSO', value: 'Enforced' },
      { label: 'Audit logging', value: 'Active' },
      { label: 'Backup cadence', value: 'Every 4 hours' },
    ],
  },
]

function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Manage your executive intelligence experience.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Configure notifications, access controls, and operational defaults to keep your leadership workflow aligned.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {settings.map((section) => (
          <div key={section.category} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <h3 className="text-xl font-semibold text-white">{section.category}</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-slate-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SettingsPage
