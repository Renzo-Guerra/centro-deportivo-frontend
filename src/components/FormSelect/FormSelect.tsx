import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";
import "./FormSelect.css";

interface Props<T extends FieldValues> {
  name: Path<T>,
  control: Control<T>
  values: (string | number)[],
  error: FieldError | undefined,
}

export const FormSelect = <T extends FieldValues>({ name, control, values, error }: Props<T>) => {
  return (
    <>
      <div className="form-select">
        <label htmlFor={name}>{name}: </label>
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            <select {...field} id={name} className={error ? "input-error" : ""}>
              {values.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          }
        />
      </div>
      {error && (
        <span className="error-msg ">{error.message}</span>
      )}
    </>
  )
}