import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

interface TopNavigationProps {
  onMenuClick: () => void
}

function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const { pathname } = useLocation()

  const sectionLabel = useMemo(() => {
    const lookup: Record<string, string> = {
      '/': 'Dashboard',
      '/ai-coach': 'AI Coach',
      '/documents': 'Documents',
      '/analytics': 'Analytics',
      '/workspace': 'Workspace',
      '/settings': 'Settings',
    }

    return lookup[pathname] ?? 'Dashboard'
  }, [pathname])

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-200 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
            MI
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Mountain Intelligence</p>
            <h1 className="text-lg font-semibold text-white">{sectionLabel}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 sm:flex">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Branch</span>
            <select
              aria-label="Current branch"
              className="bg-transparent text-sm text-slate-100 outline-none"
              defaultValue="main"
            >
              <option className="bg-slate-900" value="main">
                main
              </option>
              <option className="bg-slate-900" value="release-5-0">
                release-5-0
              </option>
              <option className="bg-slate-900" value="feature/sprint-1">
                feature/sprint-1
              </option>
            </select>
          </label>

          <button
            aria-label="Open notifications"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:text-white"
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                d="M14.5 17h-5M18 16.6V11a6 6 0 10-12 0v5.6L4 19h16l-2-2.4zM13.7 19a2 2 0 11-3.4 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            aria-label="Open user profile menu"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            type="button"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-200">
              TT
            </span>
            <span className="hidden sm:inline">Travis</span>
            <span className="text-slate-400">v</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavigation
