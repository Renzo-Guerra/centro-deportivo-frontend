import { addHours } from "date-fns";
import z from "zod";

export const turnoRangeScheema = z.object({
  desde: z.coerce.date({ error: "Campo vacío o invalido!" })
    // Por defecto zod al hacer un "z.coerce.date" utiliza UTC-0, 
    // hay que agregarle la diferencia de horas manualmente
    .transform(date => addHours(date, 3)),
  hasta: z.coerce.date({ error: "Campo vacío o invalido!" })
    .transform(date => addHours(date, 3)),
});

export type TurnoRangeValues = z.infer<typeof turnoRangeScheema> 