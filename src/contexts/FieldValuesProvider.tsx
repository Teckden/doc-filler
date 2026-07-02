import { useMemo, type ReactNode } from 'react'
import { FieldValuesContext } from './FieldValuesContext'
import { useTemplates } from '../hooks/useTemplates'
import { useFieldValuePersistence } from '../hooks/useFieldValuePersistence'

export const FieldValuesProvider = ({ children }: { children: ReactNode }) => {
  const { activeTemplate } = useTemplates()
  const { values, setValue, reset } = useFieldValuePersistence(activeTemplate?.id)

  const value = useMemo(() => ({ values, setValue, reset }), [values, setValue, reset])

  return <FieldValuesContext value={value}>{children}</FieldValuesContext>
}
