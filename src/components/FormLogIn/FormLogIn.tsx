import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LogInFormValues, logInSchema } from "../../models"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormLogIn.css";
import { FormInput } from "../FormInput/FormInput";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";

export const FormLogIn = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LogInFormValues>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "admin@gmail.com",
      contrasenia: "admin123",
    }
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitHandler = (data: LogInFormValues) => {
    setIsLoading(true);
    toast.promise(async () => axiosInterceptor.post("/autenticacion/login", data),
      {
        loading: "Enviando",
        success: "LogIn exitoso!",
      }).then(response => {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard", { replace: true });
      })
      .catch(err => {
        switch (err.status) {
          case 401: toast.error("Credenciales inválidas!\nIntente nuevamente"); break;
          default: toast.error("Ocurrió un error inesperado en el servidor...");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <form className="form formLogin" onSubmit={handleSubmit(submitHandler)}>
        <FormInput name={"email"} label="Email" type="email" control={control} error={errors.email} />
        <FormInput name={"contrasenia"} label="Contraseña" type="password" control={control} error={errors.contrasenia} />
        <button className="btn btn-primary border-radius--500" disabled={isLoading} type="submit">Loguearse</button>
        {errors.root && (
          <span className="error-msg">{errors.root.message}</span>
        )}
      </form>
    </>
  )
}