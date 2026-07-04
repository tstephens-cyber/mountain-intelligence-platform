import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', path: '/', badge: 'Live' },
  { name: 'AI Coach', path: '/ai-coach', badge: 'Guide' },
  { name: 'Documents', path: '/documents', badge: 'Intel' },
  { name: 'Analytics', path: '/analytics', badge: 'Trend' },
  { name: 'Workspace', path: '/workspace', badge: 'Flow' },
  { name: 'Settings', path: '/settings', badge: 'Ops' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 px-4 py-5 backdrop-blur transition-transform duration-300 lg:translate-x-0 lg:px-6 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 text-lg font-semibold shadow-lg shadow-cyan-500/20">
            MI
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Mountain Intelligence</p>
            <p className="text-sm text-slate-400">Executive operating system</p>
          </div>
        </div>
        <button
          aria-label="Close sidebar"
          className="rounded-xl border border-white/10 px-2 py-1 text-sm text-slate-300 lg:hidden"
          onClick={onClose}
          type="button"
        >
          X
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span>{item.name}</span>
            <span className="rounded-full border border-white/10 bg-slate-900/70 px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {item.badge}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <p className="text-sm font-semibold text-cyan-200">Command center</p>
        <p className="mt-2 text-sm text-slate-300">Synchronized operations across your executive team.</p>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Version 5.0.0 Foundation</p>
    </aside>
  )
}

export default Sidebar
