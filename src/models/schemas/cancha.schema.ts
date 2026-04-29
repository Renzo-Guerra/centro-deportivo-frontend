import z from "zod";
import { TIPOS_CANCHA_ARRAY } from "../types/cancha";

export const canchaSchema = z.object({
  nombre: z.string().min(1, "La cancha debe tener un nombre"),
  tipo: z.enum(TIPOS_CANCHA_ARRAY),
});

export type canchaValues = z.infer<typeof canchaSchema>