import z from "zod";
import { TIPOS_CANCHA_ARRAY } from "../types/cancha";

export const turnoSchema = z.object({
  nombreCliente: z.string().min(1, "Ingrese el nombre del cliente!"),
  apellidoCliente: z.string().min(1, "Ingrese el apellido del cliente!"),
  celularCliente: z.string().min(1, "Ingrese el celular del cliente!"),
  deporte: z.enum(TIPOS_CANCHA_ARRAY),
  idCancha: z.string().min(1, "Ingrese el id de la cancha!"),
  inicioTurno: z.string().min(1, "Ingrese el inicio del turno!"),
  duracionTurnoMinutos: z.coerce
    .number("¡Ingrese la duración!")
    .positive("¡La duración debe ser mayor a 0!")
    .int("¡Debe ser un número entero!"),
});

export type turnoValues = z.infer<typeof turnoSchema>