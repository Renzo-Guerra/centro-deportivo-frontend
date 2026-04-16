import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LogInFormValues, logInSchema } from "../../models"
import FormInput from "../FormInput/FormInput";

const FormLogIn = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LogInFormValues>({
    resolver: zodResolver(logInSchema)
  });

  const submitHandler = (data: LogInFormValues) => {
    console.log(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormInput name={"email"} label={"Email"} control={control} type="email" error={errors.email} />
        <FormInput name={"contrasenia"} label={"Contraseña"} control={control} type="password" error={errors.contrasenia} />
        <button type="submit">Loguearse</button>
      </form>
    </>
  )
}

export default FormLogIn;