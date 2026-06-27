import { useFieldValues } from '../contexts/FieldValuesContext'

export const DynamicForm = ({ fields }: { fields: string[] }) => {
  const { values, setValue } = useFieldValues()

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-2 @[34rem]:grid-cols-2">
      {fields.map((field) => (
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
      ))}
    </div>
  )
}
