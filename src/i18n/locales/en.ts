// English message catalog and the canonical shape for type-safe keys (see
// ../i18next.d.ts). Strings containing <code>/<b> markup are rendered through the
// <Trans> component; the rest go through t(). Literal {{placeholder}} braces that
// must survive verbatim are passed in as interpolation values (e.g. `token`), so
// i18next never mistakes them for variables of its own.
export const en = {
  common: {
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
  },
  language: {
    label: 'Select language',
  },
  navbar: {
    openMenu: 'Open menu',
    theme: 'Theme',
    templates: 'Templates',
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    lightTitle: 'Light theme',
    darkTitle: 'Dark theme',
  },
  templates: {
    untitled: 'Untitled template',
    fieldCount_one: '{{count}} field',
    fieldCount_other: '{{count}} fields',
    deleted: 'Deleted “{{name}}”',
    rename: 'Rename {{name}}',
    delete: 'Delete {{name}}',
    upload: 'Upload template',
    switch: 'Switch template — {{name}}',
  },
  empty: {
    title: 'No templates yet',
    body: 'Upload a Word document with <code>{{token}}</code> and DocFiller detects the fields automatically, building a form you can fill and export.',
    cta: 'Upload your first template',
    format: 'Supported format: .docx',
  },
  workspace: {
    title: 'Fill in document fields',
    subtitle: 'Enter a value for each field detected in <b>{{name}}</b>, then export.',
    noFields: 'No fields found in this template. You can still export it unchanged.',
  },
  progress: {
    filled: '{{filled}} of {{total}} filled',
  },
  preview: {
    show: 'Show preview',
    hide: 'Hide preview',
    title: 'Live preview',
    exportReady: 'Export ready',
    failed: 'Could not render a preview of this template.',
  },
  clear: {
    button: 'Clear',
    title: 'Clear all fields?',
    body: 'This removes every value entered for this template, ready for the next document. The template itself stays.',
    confirm: 'Clear fields',
  },
  upload: {
    title: 'Add a template',
    body: 'Upload a <code>.docx</code> with <code>{{token}}</code>. The fields are detected automatically.',
    choose: 'Choose a .docx template',
    dropzone: 'Drag a <b>.docx</b> here, or click to browse',
    invalidType: 'Please choose a .docx file.',
    added_one: 'Added “{{name}}” — {{count}} field detected',
    added_other: 'Added “{{name}}” — {{count}} fields detected',
    parseError: 'Could not parse template: {{message}}',
    parseErrorGeneric: 'Could not parse template.',
    add: 'Add template',
  },
  rename: {
    title: 'Rename template',
    name: 'Name',
  },
  export: {
    button: 'Export .docx',
    failed: 'Export failed.',
    filename: 'filled-{{name}}.docx',
  },
  footer: {
    source: 'Source code',
  },
  help: {
    title: 'How to use DocFiller',
    intro:
      'Turn a Word document with placeholders into a fillable form, then export a finished <code>.docx</code>.',
    step1Title: 'Add placeholders',
    step1Body:
      'In your Word file, wrap each variable in double curly braces, e.g. <code>{{token}}</code>. Use letters, numbers, and underscores.',
    step2Title: 'Upload & fill',
    step2Body:
      'Upload the <b>.docx</b>. DocFiller detects every placeholder and builds a labeled text field for each one.',
    step3Title: 'Export',
    step3Body:
      'Fill the fields and click <b>Export .docx</b> to download a copy named <code>filled-…docx</code> with your values inserted.',
    syntaxTitle: 'Placeholder syntax',
    syntaxNote:
      'Each unique placeholder becomes one field. Repeat the same <code>{{token}}</code> anywhere in the document and every occurrence is filled with the same value.',
    typesTitle: 'Supported field types',
    typesColType: 'Type',
    typesColHow: 'How it works',
    typesText: 'Text',
    typesTextDesc: 'The only type today. Whatever you type is inserted exactly as-is.',
    typesNote:
      'Dates, numbers, and currency are entered as plain text — type them the way they should appear (e.g. <b>Jun 22, 2026</b> or <b>$1,250.00</b>).',
    knowTitle: 'Good to know',
    knowCaseSensitive:
      'Variable names are case-sensitive — <code>{{a}}</code> and <code>{{b}}</code> are different fields.',
    knowBlank: "Leaving a field blank inserts nothing — it won't block export.",
    knowOnePass:
      "Type each placeholder in one pass so Word doesn't split it or swap in “smart quotes”; either can stop it being detected.",
    knowDocxOnly: 'Only <b>.docx</b> files are accepted.',
    knowLocal:
      'Templates are stored locally in your browser and persist across reloads — upload several and switch between them from the top bar.',
    notSupportedTitle: 'Not supported yet',
    notSupportedLoops:
      "Loops / repeating rows, conditional sections, and image placeholders are skipped — they won't appear as fields.",
    notSupportedFormats: "<b>.dotx</b> templates and PDF export aren't available.",
  },
} as const

export type Resources = typeof en
