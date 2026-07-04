import { listCommands, createReport } from 'docx-templates/lib/browser.js'

// Placeholders use the {{variableName}} convention. The same delimiter has to be
// used for extraction and rendering, or the two steps disagree on what's a field.
export const CMD_DELIMITER: [string, string] = ['{{', '}}']

// Returns the unique INS variable names referenced by the template, in first-seen
// order. Non-INS commands (loops, images, conditionals) are ignored for now.
export const extractFields = async (template: ArrayBuffer): Promise<string[]> => {
  const commands = await listCommands(template, CMD_DELIMITER)
  const fields: string[] = []
  const seen = new Set<string>()
  for (const command of commands) {
    if (command.type !== 'INS') continue
    const name = command.code.trim()
    if (name && !seen.has(name)) {
      seen.add(name)
      fields.push(name)
    }
  }
  return fields
}

// Renders the template with the supplied values. Every field must be present in
// the data: docx-templates evaluates each placeholder as a JS identifier, and an
// absent name throws ReferenceError — so unfilled fields default to ''.
export const fillTemplate = async (
  template: ArrayBuffer,
  fields: string[],
  values: Record<string, string>,
): Promise<Uint8Array> => {
  return createReport({
    template: new Uint8Array(template),
    data: Object.fromEntries(fields.map((field) => [field, values[field] ?? ''])),
    cmdDelimiter: CMD_DELIMITER,
    rejectNullish: false,
  })
}
