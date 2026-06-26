import type { ChangeEvent } from 'react'

type TemplateUploadProps = {
  onLoad: (buffer: ArrayBuffer, fileName: string) => void
  onError: (message: string) => void
}

export const TemplateUpload = ({ onLoad, onError }: TemplateUploadProps) => {
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    // Clear the value so picking the same file again still fires onChange.
    input.value = ''

    if (!file.name.toLowerCase().endsWith('.docx')) {
      onError('Please choose a .docx file.')
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      onLoad(buffer, file.name)
    } catch {
      onError('Could not read the selected file.')
    }
  }

  return (
    <input
      type="file"
      accept=".docx"
      onChange={handleChange}
      className="file-input w-full"
      aria-label="Upload a .docx template"
    />
  )
}
