import type { HTMLInputTypeAttribute } from "react";
import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  name: Path<T>,
  type: HTMLInputTypeAttribute,
  control: Control<T>
  error: FieldError | undefined,
}

export const FormInput = <T extends FieldValues>({ name, type, control, error }: Props<T>) => {
  return (
    <>
      <label htmlFor={name}>{name}: </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          <input {...field} value={field.value ?? ""} type={type} name={name} id={name} />
        }

      />
      {error && (
        <span>Hubo un error en {name}</span>
      )}
    </>
  )
}