export interface ParsedWorksheetRow {
  sheetName: string
  rowIndex: number
  cells: unknown[]
}

export interface ParserConfidence {
  score: number
  level: 'high' | 'medium' | 'low'
}

export interface ParsedMetric {
  label: string
  value: number | null
  source: string | null
  confidence: ParserConfidence
  warning: string | null
}

export interface ParserWarning {
  code: string
  message: string
  metricLabel?: string
}

export interface FinancialSnapshot {
  revenue: ParsedMetric
  revenueTarget: ParsedMetric
  scheduledRevenue: ParsedMetric
  laborDollars: ParsedMetric
  laborPercentage: ParsedMetric
  chemicalCost: ParsedMetric
  vehicleCost: ParsedMetric
  rent: ParsedMetric
  ebitda: ParsedMetric
  ebitdaPercentage: ParsedMetric
  retention: ParsedMetric
  productivity: ParsedMetric
  forecast: ParsedMetric
  warnings: ParserWarning[]
}

interface MetricDefinition {
  key: Exclude<keyof FinancialSnapshot, 'warnings'>
  label: string
  aliases: string[]
}

interface MetricCandidate {
  value: number
  confidence: number
  source: string
}

const METRIC_DEFINITIONS: MetricDefinition[] = [
  { key: 'revenue', label: 'Revenue', aliases: ['revenue', 'total revenue'] },
  { key: 'revenueTarget', label: 'Revenue Target', aliases: ['revenue target', 'target revenue', 'target'] },
  { key: 'scheduledRevenue', label: 'Scheduled Revenue', aliases: ['scheduled revenue', 'scheduled'] },
  { key: 'laborDollars', label: 'Labor Dollars', aliases: ['labor dollars', 'labor $', 'labor cost'] },
  { key: 'laborPercentage', label: 'Labor Percentage', aliases: ['labor %', 'labor percentage', 'labor pct'] },
  { key: 'chemicalCost', label: 'Chemical Cost', aliases: ['chemical cost', 'chemicals'] },
  { key: 'vehicleCost', label: 'Vehicle Cost', aliases: ['vehicle cost', 'fleet cost', 'vehicle'] },
  { key: 'rent', label: 'Rent', aliases: ['rent', 'lease'] },
  { key: 'ebitda', label: 'EBITDA', aliases: ['ebitda', 'ebita'] },
  { key: 'ebitdaPercentage', label: 'EBITDA Percentage', aliases: ['ebitda %', 'ebitda percentage', 'ebita %', 'ebita percentage'] },
  { key: 'retention', label: 'Retention', aliases: ['retention', 'customer retention'] },
  { key: 'productivity', label: 'Productivity', aliases: ['productivity', 'productive hours'] },
  { key: 'forecast', label: 'Forecast', aliases: ['forecast', 'projection'] },
]

function normalizeText(value: unknown): string {
  if (typeof value === 'string') {
    return value.toLowerCase().trim()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return ''
}

function parseNumericValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const match = value.match(/-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?/)
  if (!match) {
    return null
  }

  const parsed = Number.parseFloat(match[0].replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

function buildCellSource(sheetName: string, rowIndex: number, colIndex: number): string {
  return `${sheetName} R${rowIndex + 1} C${colIndex + 1}`
}

function findNearbyValue(cells: unknown[], index: number): { value: number | null; distance: number } {
  const offsets = [1, -1, 2, -2, 3, -3]

  for (const offset of offsets) {
    const nextIndex = index + offset
    if (nextIndex < 0 || nextIndex >= cells.length) {
      continue
    }

    const parsed = parseNumericValue(cells[nextIndex])
    if (parsed !== null) {
      return { value: parsed, distance: Math.abs(offset) }
    }
  }

  const sameCell = parseNumericValue(cells[index])
  if (sameCell !== null) {
    return { value: sameCell, distance: 0 }
  }

  return { value: null, distance: Number.POSITIVE_INFINITY }
}

function confidenceFromMatch(alias: string, cellText: string, distance: number): number {
  let confidence = 0.65

  if (cellText === alias) {
    confidence += 0.25
  } else if (cellText.includes(alias)) {
    confidence += 0.1
  }

  if (distance === 0) {
    confidence += 0.08
  } else if (distance === 1) {
    confidence += 0.06
  } else if (distance === 2) {
    confidence += 0.03
  }

  return Math.min(0.99, Number(confidence.toFixed(2)))
}

function confidenceLevel(score: number): ParserConfidence['level'] {
  if (score >= 0.85) {
    return 'high'
  }

  if (score >= 0.7) {
    return 'medium'
  }

  return 'low'
}

function emptyMetric(label: string): ParsedMetric {
  return {
    label,
    value: null,
    confidence: {
      score: 0,
      level: 'low',
    },
    source: null,
    warning: null,
  }
}

export function parseMountainFinancialSnapshot(rows: ParsedWorksheetRow[]): FinancialSnapshot {
  const candidateMap = new Map<MetricDefinition['key'], MetricCandidate[]>()

  for (const row of rows) {
    for (let colIndex = 0; colIndex < row.cells.length; colIndex += 1) {
      const cellText = normalizeText(row.cells[colIndex])
      if (!cellText) {
        continue
      }

      for (const metric of METRIC_DEFINITIONS) {
        const matchedAlias = metric.aliases.find((alias) => cellText.includes(alias))
        if (!matchedAlias) {
          continue
        }

        const nearbyValue = findNearbyValue(row.cells, colIndex)
        if (nearbyValue.value === null) {
          continue
        }

        const candidate: MetricCandidate = {
          value: nearbyValue.value,
          confidence: confidenceFromMatch(matchedAlias, cellText, nearbyValue.distance),
          source: buildCellSource(row.sheetName, row.rowIndex, colIndex),
        }

        const current = candidateMap.get(metric.key) ?? []
        current.push(candidate)
        candidateMap.set(metric.key, current)
      }
    }
  }

  const warnings: ParserWarning[] = []
  const snapshot: FinancialSnapshot = {
    revenue: emptyMetric('Revenue'),
    revenueTarget: emptyMetric('Revenue Target'),
    scheduledRevenue: emptyMetric('Scheduled Revenue'),
    laborDollars: emptyMetric('Labor Dollars'),
    laborPercentage: emptyMetric('Labor Percentage'),
    chemicalCost: emptyMetric('Chemical Cost'),
    vehicleCost: emptyMetric('Vehicle Cost'),
    rent: emptyMetric('Rent'),
    ebitda: emptyMetric('EBITDA'),
    ebitdaPercentage: emptyMetric('EBITDA Percentage'),
    retention: emptyMetric('Retention'),
    productivity: emptyMetric('Productivity'),
    forecast: emptyMetric('Forecast'),
    warnings,
  }

  for (const metric of METRIC_DEFINITIONS) {
    const candidates = candidateMap.get(metric.key) ?? []

    if (candidates.length === 0) {
      warnings.push({
        code: 'METRIC_NOT_FOUND',
        message: `${metric.label} was not found.`,
        metricLabel: metric.label,
      })
      continue
    }

    const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence)
    const best = sorted[0]

    snapshot[metric.key] = {
      label: metric.label,
      value: best.value,
      confidence: {
        score: best.confidence,
        level: confidenceLevel(best.confidence),
      },
      source: best.source,
      warning: best.confidence < 0.7 ? `Low confidence match for ${metric.label}.` : null,
    }

    if (sorted.length > 1) {
      warnings.push({
        code: 'MULTIPLE_MATCHES',
        message: `${metric.label} had multiple matches. Using the most likely value from ${best.source}.`,
        metricLabel: metric.label,
      })
    }

    if (best.confidence < 0.7) {
      warnings.push({
        code: 'LOW_CONFIDENCE',
        message: `Low confidence extraction for ${metric.label} at ${best.source}.`,
        metricLabel: metric.label,
      })
    }
  }

  return snapshot
}
