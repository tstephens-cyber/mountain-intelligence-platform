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

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['.xlsx', '.xls', '.csv', '.pdf'] as const

function getDocumentType(fileName: string): DocumentType | null {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'xlsx' || extension === 'xls' || extension === 'csv' || extension === 'pdf') {
    return extension
  }

  return null
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
