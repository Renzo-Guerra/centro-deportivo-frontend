import z from "zod";

export const turnoRangeScheema = z.object({
  desde: z.string("Especifique desde que fecha quiere filtrar los turnos!"),
  hasta: z.string("Especifique hasta que fecha quiere filtrar los turnos!"),
});

export type TurnoRangeValues = z.infer<typeof turnoRangeScheema> 