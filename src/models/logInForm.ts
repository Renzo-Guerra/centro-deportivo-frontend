import z from "zod";

export const logInSchema = z.object({
  email: z.email("Ingrese un email valido"),
  contrasenia: z.string("Campo requerido").min(1, "Ingrese la contraseña"),
});

export type LogInFormValues = z.infer<typeof logInSchema>