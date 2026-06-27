import { DocumentIcon, PlusIcon } from './icons'

type EmptyStateProps = {
  onUpload: () => void
}

export const EmptyState = ({ onUpload }: EmptyStateProps) => (
  <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
    <div className="grid size-20 place-items-center rounded-box border-2 border-dashed border-base-300">
      <DocumentIcon className="size-8 text-base-content/35" />
    </div>
    <h2 className="mt-5 text-lg font-semibold">No templates yet</h2>
    <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-base-content/65">
      Upload a Word document with{' '}
      <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs">
        {'{{placeholders}}'}
      </code>{' '}
      and DocFiller detects the fields automatically, building a form you can fill and export.
    </p>
    <button type="button" className="btn btn-primary mt-5 gap-1.5" onClick={onUpload}>
      <PlusIcon className="size-4" />
      Upload your first template
    </button>
    <p className="mt-3 text-xs text-base-content/45">Supported format: .docx</p>
  </div>
)
