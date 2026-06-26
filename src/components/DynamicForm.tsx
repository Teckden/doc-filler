type DynamicFormProps = {
  fields: string[]
  values: Record<string, string>
  onChange: (field: string, value: string) => void
}

export const DynamicForm = ({ fields, values, onChange }: DynamicFormProps) => {
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <label key={field} className="floating-label">
          <span>{field}</span>
          <input
            className="input input-md w-full"
            type="text"
            placeholder={field}
            value={values[field] ?? ''}
            onChange={(event) => onChange(field, event.target.value)}
          />
        </label>
      ))}
    </div>
  )
}
