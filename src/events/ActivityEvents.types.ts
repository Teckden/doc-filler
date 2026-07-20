export type ActivityEvent =
  | { type: 'export'; perfect: boolean; dark: boolean }
  | { type: 'upload' }
  | { type: 'preset' }
  | { type: 'presetApplied' }
  | { type: 'packExport' }
  | { type: 'packImport' }
  | { type: 'langSwitch' }
  | { type: 'clear' }
  | { type: 'open' }
