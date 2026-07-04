import { useMemo, useState, type ChangeEvent, type DragEvent } from 'react'
import AlertCard from '../components/AlertCard'
import ExecutiveBriefCard from '../components/ExecutiveBriefCard'
import {
  ACCEPTED_DOCUMENT_EXTENSIONS,
  analyzeFinancialDocument,
  createUploadedDocument,
  type FinancialExtractionResult,
  type UploadedDocument,
} from '../services/documentService'

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTimestamp(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function statusLabel(status: UploadedDocument['status']): string {
  if (status === 'ready_for_analysis') {
    return 'Ready for analysis'
  }

  return status
}

function mergeDocuments(existing: UploadedDocument[], incoming: UploadedDocument[]): UploadedDocument[] {
  const byId = new Map(existing.map((doc) => [doc.id, doc]))

  for (const document of incoming) {
    byId.set(document.id, document)
  }

  return Array.from(byId.values())
}

function DocumentIntelligencePage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [analysisResult, setAnalysisResult] = useState<FinancialExtractionResult | null>(null)

  const acceptedTypesLabel = useMemo(() => ACCEPTED_DOCUMENT_EXTENSIONS.join(', '), [])

  function processFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return
    }

    const mappedDocuments = Array.from(fileList)
      .map((file) => createUploadedDocument(file))
      .filter((document): document is UploadedDocument => Boolean(document))

    if (mappedDocuments.length === 0) {
      setUploadError('Unsupported file type. Please upload .xlsx, .xls, .csv, or .pdf files.')
      return
    }

    setUploadError('')
    setAnalysisError('')
    setAnalysisResult(null)
    setUploadedDocuments((previous) => mergeDocuments(previous, mappedDocuments))
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    processFiles(event.target.files)
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)
    processFiles(event.dataTransfer.files)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setIsDragActive(false)
  }

  async function handleAnalyzeDocument() {
    if (uploadedDocuments.length === 0) {
      return
    }

    const documentToAnalyze = uploadedDocuments[uploadedDocuments.length - 1]

    setIsAnalyzing(true)
    setAnalysisError('')
    setAnalysisResult(null)

    try {
      const result = await analyzeFinancialDocument(documentToAnalyze.file)
      setAnalysisResult(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to analyze this document right now.'
      setAnalysisError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Document Intelligence</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Capture critical signal from every document.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Extract compliance flags, commercial commitments, and negotiation risks for executive review without manual triage.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <h3 className="text-xl font-semibold text-white">Upload and review</h3>
          <p className="mt-2 text-sm text-slate-300">Accepted files: {acceptedTypesLabel}</p>

          <div
            className={`mt-5 rounded-[2rem] border border-dashed p-8 text-center text-sm transition ${
              isDragActive
                ? 'border-cyan-300/60 bg-cyan-500/10 text-cyan-100'
                : 'border-cyan-400/25 bg-slate-950/60 text-slate-300'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="font-semibold text-white">Drag and drop documents here</p>
            <p className="mt-3">Upload financial spreadsheets or reports for document intelligence workflows.</p>

            <label className="mt-5 inline-flex cursor-pointer items-center rounded-2xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-cyan-300/40 hover:bg-slate-800">
              Choose Files
              <input
                accept={ACCEPTED_DOCUMENT_EXTENSIONS.join(',')}
                className="sr-only"
                multiple
                onChange={handleFileInputChange}
                type="file"
              />
            </label>
          </div>

          {uploadError ? (
            <p className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{uploadError}</p>
          ) : null}

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Uploaded files</h4>
              <span className="text-xs text-slate-500">{uploadedDocuments.length} total</span>
            </div>

            <div className="mt-3 space-y-3">
              {uploadedDocuments.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-400">
                  No documents uploaded yet.
                </div>
              ) : (
                uploadedDocuments.map((document) => (
                  <div key={document.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{document.name}</p>
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-200">
                        {statusLabel(document.status)}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-slate-400 sm:grid-cols-3">
                      <p>Type: {document.type.toUpperCase()}</p>
                      <p>Size: {formatFileSize(document.sizeBytes)}</p>
                      <p>Uploaded: {formatTimestamp(document.uploadedAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              className="inline-flex items-center rounded-2xl bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={uploadedDocuments.length === 0 || isAnalyzing}
              onClick={handleAnalyzeDocument}
              type="button"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
            </button>
          </div>

          {analysisError ? (
            <p className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{analysisError}</p>
          ) : null}

          {analysisResult ? (
            <div className="mt-4 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              <p className="font-semibold">Extraction results for {analysisResult.fileName}</p>

              <div className="mt-3 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Extracted metrics</p>
                {analysisResult.metrics.length === 0 ? (
                  <p className="text-sm text-cyan-50">No financial metrics were extracted.</p>
                ) : (
                  <ul className="space-y-2">
                    {analysisResult.metrics.map((metric) => (
                      <li key={metric.key} className="rounded-xl border border-cyan-300/20 bg-slate-900/40 px-3 py-2 text-sm text-cyan-50">
                        <span className="font-semibold">{metric.label}:</span> {metric.value.toLocaleString('en-US')} <span className="text-xs text-cyan-200">({metric.source})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Warnings</p>
                {analysisResult.warnings.length === 0 ? (
                  <p className="text-sm text-cyan-50">No extraction warnings.</p>
                ) : (
                  <ul className="space-y-1">
                    {analysisResult.warnings.map((warning) => (
                      <li key={warning.key} className="text-sm text-cyan-50">
                        - {warning.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <ExecutiveBriefCard
            title="Intelligence extraction"
            summary="The platform has automatically surfaced three compliance exceptions and a third-party escalation item for immediate review."
            highlights={['Legal review recommended for contract renewal terms', 'Action item: assign compliance owner for new vendor reviews', 'Summarize governance impact for the next board meeting']}
          />
          <AlertCard
            title="Document signal"
            message="A critical supply agreement clause requires executive sign-off before the 72-hour deadline."
            variant="critical"
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentIntelligencePage
