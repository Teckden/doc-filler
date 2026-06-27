import { createContext, useContext } from 'react'

export type FieldValuesContextValue = {
  values: Record<string, string>
  setValue: (field: string, value: string) => void
  reset: () => void
}

export const FieldValuesContext = createContext<FieldValuesContextValue | null>(null)

export const useFieldValues = (): FieldValuesContextValue => {
  const context = useContext(FieldValuesContext)
  if (!context) throw new Error('useFieldValues must be used within a FieldValuesProvider')
  return context
}
