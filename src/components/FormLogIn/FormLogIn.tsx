import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LogInFormValues, logInSchema } from "../../models"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormLogIn.css";
import { useFetchManual } from "../../hooks";
import { FormInput } from "../FormInput/FormInput";
import toast from "react-hot-toast";

export const FormLogIn = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LogInFormValues>({
    resolver: zodResolver(logInSchema)
  });

  const navigate = useNavigate();

  const { data, isLoading, error, submitRequest } = useFetchManual<{ token: string }>();

  // Al enviarse el form, si el log in es valido, devolverá el token al usuario, 
  // el cual guardaremos en el Local Storage
  useEffect(() => {
    if (data) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { replace: true })
    }
    if (error) {
      switch (error.status) {
        case 401: toast.error("Credenciales inválidas!\nIntente nuevamente"); break;
        default: toast.error("Ocurrió un error inesperado en el servidor...");
      }
    }
  }, [data, error])

  const submitHandler = (data: LogInFormValues) => {
    const urlLogIn = "/autenticacion/login";
    submitRequest(urlLogIn, "POST", data);
  }

  return (
    <>
      <form className="formLogin" onSubmit={handleSubmit(submitHandler)}>
        <FormInput name={"email"} type="email" control={control} error={errors.email} />
        <FormInput name={"contrasenia"} type="password" control={control} error={errors.contrasenia} />
        <button className="btn" disabled={isLoading} type="submit">Loguearse</button>
        {errors.root && (
          <span className="error-msg">{errors.root.message}</span>
        )}
      </form>
    </>
  )
}