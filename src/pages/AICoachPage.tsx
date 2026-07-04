import { useState } from 'react'
import type { FormEvent } from 'react'
import AlertCard from '../components/AlertCard'
import ExecutiveBriefCard from '../components/ExecutiveBriefCard'
import { askCoach } from '../services/coachApi'
import type { CoachType } from '../services/coachApi'

const coachTypeOptions: Array<{ label: string; value: CoachType }> = [
  { label: 'Executive', value: 'executive' },
  { label: 'Finance', value: 'finance' },
  { label: 'Operations', value: 'operations' },
  { label: 'Sales', value: 'sales' },
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
  const [coachType, setCoachType] = useState<CoachType>('executive')
  const [question, setQuestion] = useState('')
  const [replyText, setReplyText] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!question.trim()) {
      setError('Please enter a question before submitting.')
      return
    }

    setLoading(true)
    setError('')
    setReplyText('')

    try {
      const result = await askCoach({
        coach_type: coachType,
        question: question.trim(),
      })

      setReplyText(result.displayText)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to connect to AI Coach right now.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

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
          <h3 className="text-xl font-semibold text-white">Ask AI Coach</h3>
          <p className="mt-2 text-sm text-slate-300">Submit a question and get live coaching guidance from the backend.</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Coach Type</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
                onChange={(event) => setCoachType(event.target.value as CoachType)}
                value={coachType}
              >
                {coachTypeOptions.map((option) => (
                  <option key={option.value} className="bg-slate-950" value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Question</span>
              <textarea
                className="min-h-36 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask for executive, financial, operations, or sales guidance..."
                value={question}
              />
            </label>

            <button
              className="inline-flex items-center rounded-2xl bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Sending to Coach...' : 'Submit Question'}
            </button>
          </form>

          {error ? (
            <p className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>
          ) : null}

          {replyText ? (
            <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Coach Response</p>
              <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm text-slate-100">{replyText}</pre>
            </div>
          ) : null}
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
