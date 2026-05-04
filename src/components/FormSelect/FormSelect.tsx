import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";
import "./FormSelect.css";
import type { OptionForSelect } from "../../models/types/optionForSelect";

interface Props<T extends FieldValues> {
  name: Path<T>,
  label: string,
  control: Control<T>
  options: OptionForSelect[],
  error: FieldError | undefined,
  isDisabled?: boolean,
}

export const FormSelect = <T extends FieldValues>({ name, label, control, options, error, isDisabled = false }: Props<T>) => {
  return (
    <>
      <div className="form-select">
        <label htmlFor={name}>{label}: </label>
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            <select {...field} id={name} className={error ? "input-error" : ""} disabled={isDisabled}>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          }
        />
        {error && (
          <span className="error-msg ">{error.message}</span>
        )}
      </div>
    </>
  )
}