import { useState } from 'react'
import { saveAs } from 'file-saver'
import { fillTemplate } from '../lib/docx'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

type ExportButtonProps = {
  template: { buffer: ArrayBuffer; name: string } | null
  values: Record<string, string>
  onError: (message: string) => void
}

export const ExportButton = ({ template, values, onError }: ExportButtonProps) => {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!template) return
    setExporting(true)
    try {
      const report = await fillTemplate(template.buffer, values)
      // docx-templates types the result's buffer as the wider ArrayBufferLike;
      // in the browser it's always a plain ArrayBuffer, safe for a Blob.
      const blob = new Blob([report as Uint8Array<ArrayBuffer>], { type: DOCX_MIME })
      saveAs(blob, `filled-${template.name}`)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Export failed.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={!template || exporting}
      onClick={handleExport}
    >
      {exporting && <span className="loading loading-spinner"></span>}
      Export .docx
    </button>
  )
}
