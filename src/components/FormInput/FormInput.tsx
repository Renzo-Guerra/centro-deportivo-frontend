import { Controller, type Control, type FieldError } from "react-hook-form";
import type { LogInFormValues } from "../../models";
import type { HTMLInputTypeAttribute } from "react";
import "./FormInput.css";

interface Props {
  name: keyof LogInFormValues,
  label: string,
  control: Control<LogInFormValues>,
  type?: HTMLInputTypeAttribute,
  error?: FieldError,
}

const FormInput = ({ name, label, control, type = "text", error }: Props) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          <input {...field} id={name} type={type} className={error ? "input-error" : ""} />
        }
      />
      {error && <span className="error-msg">{error.message}</span>}
    </div>
  )
}

export default FormInput;