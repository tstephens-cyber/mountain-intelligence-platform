interface AlertCardProps {
  title: string
  message: string
  variant?: 'info' | 'warning' | 'critical'
}

const variantStyles: Record<string, string> = {
  info: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-100',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
  critical: 'border-rose-500/20 bg-rose-500/10 text-rose-100',
}

function AlertCard({ title, message, variant = 'info' }: AlertCardProps) {
  return (
    <div className={`rounded-3xl border px-5 py-4 shadow-sm shadow-slate-950/20 ${variantStyles[variant]}`}>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{message}</p>
    </div>
  )
}

export default AlertCard
