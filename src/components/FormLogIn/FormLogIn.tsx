import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LogInFormValues, logInSchema } from "../../models"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormLogIn.css";
import { useFetchManual } from "../../hooks";
import { FormInput } from "../FormInput/FormInput";

export const FormLogIn = () => {
  const {
    handleSubmit,
    control,
    setError,
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
      setError("root", {
        message: "Credenciales inválidas o error de conexión."
      });
    }
  }, [data, error])

  const submitHandler = (data: LogInFormValues) => {
    const urlLogIn = "/autenticacion/login";
    submitRequest(urlLogIn, "post", data);
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