import { useCallback, useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import { fillTemplate } from '../lib/docx'
import type { StoredTemplate } from '../db/templates'

export type PreviewStatus = 'loading' | 'ready' | 'error'

const RENDER_DEBOUNCE_MS = 250

// Renders the active template, filled with the current values, into `docRef`.
// The fill goes through the same fillTemplate the export uses, so the preview
// always matches the exported file. Renders are debounced per keystroke and
// serialized through a queue — renderAsync mutates the container in place, so
// two renders must never overlap. `hostRef` marks the element whose width the
// document is zoomed to fit (the .docx page keeps its true size in CSS px).
export const useDocxPreview = (template: StoredTemplate, values: Record<string, string>) => {
  const hostRef = useRef<HTMLDivElement>(null)
  const docRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<PreviewStatus>('loading')
  const seq = useRef(0)
  const queue = useRef<Promise<void>>(Promise.resolve())
  const renderedTemplateId = useRef<string | null>(null)

  const fitZoom = useCallback(() => {
    const host = hostRef.current
    const doc = docRef.current
    const page = doc?.querySelector<HTMLElement>('section.docx')
    if (!host || !doc || !page || page.offsetWidth === 0) return
    doc.style.zoom = String(Math.min(1, host.clientWidth / page.offsetWidth))
  }, [])

  useEffect(() => {
    // On a template switch, blank the pane instead of leaving the previous
    // document up while the new one renders.
    if (renderedTemplateId.current !== template.id) {
      renderedTemplateId.current = null
      docRef.current?.replaceChildren()
      setStatus('loading')
    }

    const current = ++seq.current
    const timer = setTimeout(() => {
      queue.current = queue.current.then(async () => {
        // A newer render superseded this one while it sat in the queue.
        if (current !== seq.current) return
        try {
          const buffer = await template.blob.arrayBuffer()
          const report = await fillTemplate(buffer, template.fields, values)
          if (current !== seq.current || !docRef.current) return
          await renderAsync(report, docRef.current, undefined, { inWrapper: false })
          if (current !== seq.current) {
            // Superseded while renderAsync was in flight. After a template
            // switch the write is stale content in a blanked pane — wipe it.
            // For a same-template value update, keep it: the newer queued
            // render replaces it in place without flashing an empty pane.
            if (renderedTemplateId.current !== template.id) docRef.current?.replaceChildren()
            return
          }
          renderedTemplateId.current = template.id
          setStatus('ready')
          fitZoom()
        } catch (error) {
          console.error('Preview render failed:', error)
          if (current === seq.current) setStatus('error')
        }
      })
    }, RENDER_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [template, values, fitZoom])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new ResizeObserver(fitZoom)
    observer.observe(host)
    return () => observer.disconnect()
  }, [fitZoom])

  return { hostRef, docRef, status }
}
