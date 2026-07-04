import * as XLSX from 'xlsx'
import {
  parseMountainFinancialSnapshot,
  type FinancialSnapshot,
  type ParsedWorksheetRow,
  type ParserConfidence,
} from './mountainFinancialParser'

export type DocumentStatus = 'ready_for_analysis'

export type DocumentType = 'xlsx' | 'xls' | 'csv' | 'pdf'

export interface UploadedDocument {
  id: string
  name: string
  sizeBytes: number
  uploadedAt: string
  status: DocumentStatus
  type: DocumentType
  file: File
}

export interface ExtractedMetric {
  key: string
  label: string
  value: number
  confidence: ParserConfidence
  source: string
  warning: string | null
}

export interface ExtractionWarning {
  key: string
  message: string
}

export interface FinancialExtractionResult {
  fileName: string
  documentType: DocumentType
  metrics: ExtractedMetric[]
  warnings: ExtractionWarning[]
  snapshot: FinancialSnapshot | null
}

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['.xlsx', '.xls', '.csv', '.pdf'] as const

const FINANCIAL_METRICS: Array<{ key: string; label: string; aliases: string[] }> = [
  { key: 'revenue', label: 'Revenue', aliases: ['revenue'] },
  { key: 'sales', label: 'Sales', aliases: ['sales'] },
  { key: 'target', label: 'Target', aliases: ['target'] },
  { key: 'scheduled', label: 'Scheduled', aliases: ['scheduled'] },
  { key: 'ebitda', label: 'EBITDA', aliases: ['ebitda'] },
  { key: 'ebitdaPercentage', label: 'EBITDA Percentage', aliases: ['ebitda %', 'ebitda percentage', 'ebita %'] },
  { key: 'ebita', label: 'EBITA', aliases: ['ebita'] },
  { key: 'labor', label: 'Labor', aliases: ['labor'] },
  { key: 'retention', label: 'Retention', aliases: ['retention'] },
  { key: 'cogs', label: 'COGS', aliases: ['cogs'] },
]

function getDocumentType(fileName: string): DocumentType | null {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'xlsx' || extension === 'xls' || extension === 'csv' || extension === 'pdf') {
    return extension
  }

  return null
}

function normalizeCellText(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }

  if (typeof value === 'number') {
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

function findNumericValueInRow(cells: unknown[], startIndex: number): number | null {
  const priorities = [startIndex + 1, startIndex - 1, startIndex + 2, startIndex - 2]

  for (const index of priorities) {
    if (index >= 0 && index < cells.length) {
      const parsed = parseNumericValue(cells[index])
      if (parsed !== null) {
        return parsed
      }
    }
  }

  for (const cell of cells) {
    const parsed = parseNumericValue(cell)
    if (parsed !== null) {
      return parsed
    }
  }

  return null
}

function rowsFromWorkbook(workbook: XLSX.WorkBook): ParsedWorksheetRow[] {
  const rows: ParsedWorksheetRow[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      continue
    }

    const sheetRows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      defval: '',
    }) as unknown[][]

    sheetRows.forEach((cells, rowIndex) => {
      rows.push({ sheetName, rowIndex, cells })
    })
  }

  return rows
}

async function workbookFromFile(file: File, type: DocumentType): Promise<XLSX.WorkBook> {
  if (type === 'csv') {
    const text = await file.text()
    return XLSX.read(text, { type: 'string', raw: true })
  }

  const buffer = await file.arrayBuffer()
  return XLSX.read(buffer, { type: 'array', raw: true })
}

export async function analyzeFinancialDocument(file: File): Promise<FinancialExtractionResult> {
  const detectedType = getDocumentType(file.name)

  if (!detectedType) {
    throw new Error('Unsupported file type. Please upload .xlsx, .xls, .csv, or .pdf files.')
  }

  if (detectedType === 'pdf') {
    return {
      fileName: file.name,
      documentType: detectedType,
      metrics: [],
      warnings: [
        {
          key: 'pdf',
          message: 'Local financial extraction currently supports .csv, .xls, and .xlsx files.',
        },
      ],
      snapshot: null,
    }
  }

  const workbook = await workbookFromFile(file, detectedType)
  const rows = rowsFromWorkbook(workbook)
  const snapshot = parseMountainFinancialSnapshot(rows)
  const metrics = new Map<string, ExtractedMetric>()

  for (const row of rows) {
    for (let index = 0; index < row.cells.length; index += 1) {
      const cellText = normalizeCellText(row.cells[index])
      if (!cellText) {
        continue
      }

      for (const metric of FINANCIAL_METRICS) {
        if (metrics.has(metric.key)) {
          continue
        }

        const hasMatch = metric.aliases.some((alias) => cellText.includes(alias))
        if (!hasMatch) {
          continue
        }

        const value = findNumericValueInRow(row.cells, index)
        if (value === null) {
          continue
        }

        metrics.set(metric.key, {
          key: metric.key,
          label: metric.label,
          value,
          confidence: {
            score: 0.7,
            level: 'medium',
          },
          source: `${row.sheetName} R${row.rowIndex + 1} C${index + 1}`,
          warning: null,
        })
      }
    }
  }

  const snapshotMetricMap: Array<{ key: string; label: string; data: FinancialSnapshot[keyof Omit<FinancialSnapshot, 'warnings'>] }> = [
    { key: 'revenue', label: 'Revenue', data: snapshot.revenue },
    { key: 'revenueTarget', label: 'Revenue Target', data: snapshot.revenueTarget },
    { key: 'scheduledRevenue', label: 'Scheduled Revenue', data: snapshot.scheduledRevenue },
    { key: 'laborDollars', label: 'Labor Dollars', data: snapshot.laborDollars },
    { key: 'laborPercentage', label: 'Labor Percentage', data: snapshot.laborPercentage },
    { key: 'chemicalCost', label: 'Chemical Cost', data: snapshot.chemicalCost },
    { key: 'vehicleCost', label: 'Vehicle Cost', data: snapshot.vehicleCost },
    { key: 'rent', label: 'Rent', data: snapshot.rent },
    { key: 'ebitda', label: 'EBITDA', data: snapshot.ebitda },
    { key: 'ebitdaPercentage', label: 'EBITDA Percentage', data: snapshot.ebitdaPercentage },
    { key: 'retention', label: 'Retention', data: snapshot.retention },
    { key: 'productivity', label: 'Productivity', data: snapshot.productivity },
    { key: 'forecast', label: 'Forecast', data: snapshot.forecast },
  ]

  for (const metric of snapshotMetricMap) {
    if (metric.data.value === null || !metric.data.source) {
      continue
    }

    metrics.set(metric.key, {
      key: metric.key,
      label: metric.label,
      value: metric.data.value,
      confidence: metric.data.confidence,
      source: metric.data.source,
      warning: metric.data.warning,
    })
  }

  const extractedMetrics = Array.from(metrics.values())
  const warningsFromMetrics: ExtractionWarning[] = FINANCIAL_METRICS.filter((metric) => !metrics.has(metric.key)).map((metric) => ({
    key: metric.key,
    message: `${metric.label} was not found in the uploaded file.`,
  }))
  const parserWarnings: ExtractionWarning[] = snapshot.warnings.map((warning, index) => ({
    key: `snapshot-${index + 1}`,
    message: warning.message,
  }))
  const warnings = [...warningsFromMetrics, ...parserWarnings]

  return {
    fileName: file.name,
    documentType: detectedType,
    metrics: extractedMetrics,
    warnings,
    snapshot,
  }
}

export function createUploadedDocument(file: File): UploadedDocument | null {
  const type = getDocumentType(file.name)

  if (!type) {
    return null
  }

  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    sizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
    status: 'ready_for_analysis',
    type,
    file,
  }
}
