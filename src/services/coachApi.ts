export const COACH_API_BASE_URL = 'https://mountain-intelligence-coach-backend.onrender.com'

export type CoachType = 'executive' | 'finance' | 'operations' | 'sales'

export interface CoachRequest {
  coach_type: CoachType
  question: string
}

export interface CoachApiResult {
  data: unknown
  displayText: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function stringifyUnknown(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

export function getCoachDisplayText(payload: unknown): string {
  if (!isRecord(payload)) {
    return stringifyUnknown(payload)
  }

  const preferredKeys: Array<'response' | 'answer' | 'message'> = ['response', 'answer', 'message']

  for (const key of preferredKeys) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return stringifyUnknown(payload)
}

export async function askCoach(request: CoachRequest): Promise<CoachApiResult> {
  const response = await fetch(`${COACH_API_BASE_URL}/coach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    payload = { message: 'The backend returned a non-JSON response.' }
  }

  if (!response.ok) {
    const errorText = getCoachDisplayText(payload)
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  return {
    data: payload,
    displayText: getCoachDisplayText(payload),
  }
}
