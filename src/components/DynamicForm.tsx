import { useFieldValues } from '../contexts/FieldValuesContext'
import { usePresets } from '../hooks/usePresets'
import { matchingPresets, normalizeFieldKey } from '../db/presets'
import { PresetCombobox } from './PresetCombobox'

export const DynamicForm = ({ fields }: { fields: string[] }) => {
  const { values, setValue } = useFieldValues()
  const { presets, choices } = usePresets()

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-2 @[34rem]:grid-cols-2">
      {fields.map((field) => {
        const matched = matchingPresets(presets, field)
        if (matched.length > 0) {
          return (
            <PresetCombobox
              key={field}
              field={field}
              matched={matched}
              chosenId={choices[normalizeFieldKey(field)]}
            />
          )
        }
        return (
          <fieldset key={field} className="fieldset">
            <legend className="fieldset-legend">{field}</legend>
            <input
              className="input w-full"
              type="text"
              placeholder={field}
              value={values[field] ?? ''}
              onChange={(event) => setValue(field, event.target.value)}
            />
          </fieldset>
        )
      })}
    </div>
  )
}
