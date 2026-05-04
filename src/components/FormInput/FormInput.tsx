import type { HTMLInputTypeAttribute } from "react";
import { Controller, type Control, type FieldError, type FieldErrorsImpl, type FieldValues, type Merge, type Path } from "react-hook-form";
import "./FormInput.css";

interface Props<T extends FieldValues> {
  name: Path<T>,
  label: string,
  type: HTMLInputTypeAttribute,
  control: Control<T>
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined,
  isDisabled?: boolean,
}

export const FormInput = <T extends FieldValues>({ name, label, type, control, error, isDisabled = false }: Props<T>) => {
  return (
    <>
      <div className="form-input">
        <label htmlFor={name}>{label}: </label>
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            <input {...field} value={field.value ?? ""} className={error ? "input-error" : ""} type={type} name={name} id={name} disabled={isDisabled} />
          }
        />
        {error && (
          <span className="error-msg ">{JSON.stringify(error.message)}</span>
        )}
      </div>
    </>
  )
}