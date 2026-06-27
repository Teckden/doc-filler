import { useState } from 'react'
import { saveAs } from 'file-saver'
import { fillTemplate } from '../lib/docx'
import { useFieldValues } from '../contexts/FieldValuesContext'
import { useAppState } from '../contexts/AppStateContext'
import { useTemplates } from '../hooks/useTemplates'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// The active template's raw .docx is converted to an ArrayBuffer here, at export
// time, before handing it to docx-templates.
export const ExportButton = ({ className = 'btn btn-primary' }: { className?: string }) => {
  const { activeTemplate } = useTemplates()
  const { values } = useFieldValues()
  const { notify } = useAppState()
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!activeTemplate) return
    setExporting(true)
    try {
      const buffer = await activeTemplate.blob.arrayBuffer()
      const report = await fillTemplate(buffer, values)
      // docx-templates types the result's buffer as the wider ArrayBufferLike;
      // in the browser it's always a plain ArrayBuffer, safe for a Blob.
      const blob = new Blob([report as Uint8Array<ArrayBuffer>], { type: DOCX_MIME })
      saveAs(blob, `filled-${activeTemplate.name}.docx`)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Export failed.', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={!activeTemplate || exporting}
      onClick={handleExport}
    >
      {exporting && <span className="loading loading-spinner loading-xs"></span>}
      Export .docx
    </button>
  )
}
