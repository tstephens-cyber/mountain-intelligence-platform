import {
  parseMountainFinancialSnapshot,
  type FinancialSnapshot,
  type ParsedWorksheetRow,
  type ParserConfidence,
} from './mountainFinancialParser'
import type { WorkBook } from 'xlsx'

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

function getDocumentType(fileName: string): DocumentType | null {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'xlsx' || extension === 'xls' || extension === 'csv' || extension === 'pdf') {
    return extension
  }

  return null
}

type XlsxModule = typeof import('xlsx')

async function loadXlsxModule(): Promise<XlsxModule> {
  return import('xlsx')
}

function rowsFromWorkbook(workbook: WorkBook, xlsxModule: XlsxModule): ParsedWorksheetRow[] {
  const rows: ParsedWorksheetRow[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      continue
    }

    const sheetRows = xlsxModule.utils.sheet_to_json(sheet, {
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

async function workbookFromFile(file: File, type: DocumentType, xlsxModule: XlsxModule): Promise<WorkBook> {

  if (type === 'csv') {
    const text = await file.text()
    return xlsxModule.read(text, { type: 'string', raw: true })
  }

  const buffer = await file.arrayBuffer()
  return xlsxModule.read(buffer, { type: 'array', raw: true })
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

  const xlsxModule = await loadXlsxModule()
  const workbook = await workbookFromFile(file, detectedType, xlsxModule)
  const rows = rowsFromWorkbook(workbook, xlsxModule)
  const snapshot = parseMountainFinancialSnapshot(rows)
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

  const metrics = new Map<string, ExtractedMetric>()

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
  const parserWarnings: ExtractionWarning[] = snapshot.warnings.map((warning, index) => ({
    key: `${warning.code}-${index + 1}`,
    message: warning.message,
  }))

  return {
    fileName: file.name,
    documentType: detectedType,
    metrics: extractedMetrics,
    warnings: parserWarnings,
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
