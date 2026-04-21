import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LogInFormValues, logInSchema } from "../../models"
import FormInput from "../FormInput/FormInput";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FormLogIn = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LogInFormValues>({
    resolver: zodResolver(logInSchema)
  });

  const navigate = useNavigate();

  const { data, isLoading, error, submitRequest } = useFetch();

  // Al enviarse el form, si el log in es valido, devolverá el token al usuario, 
  // el cual guardaremos en el Local Storage
  useEffect(() => {
    if (data) {
      localStorage.setItem("token", data.token);
      navigate("" /* Agregar url cuando esté el dashboard */, { replace: true })
    }
  }, [data])

  const submitHandler = (data: LogInFormValues) => {
    const urlLogIn = "http://localhost:8080/api/autenticacion/login";
    submitRequest(urlLogIn, "post", data);
  }

  return (
    <>
      {isLoading && (
        <p>Cargando...</p>
      )}

      {data && (
        <p>Token guardado!</p>
      )}

      {error && (
        <p>Error al ingresar usuario y contraseña, intente nuevamente!</p>
      )}

      <form onSubmit={handleSubmit(submitHandler)}>
        <FormInput name={"email"} label={"Email"} control={control} type="email" error={errors.email} />
        <FormInput name={"contrasenia"} label={"Contraseña"} control={control} type="password" error={errors.contrasenia} />
        <button type="submit">Loguearse</button>
      </form>
    </>
  )
}

export default FormLogIn;