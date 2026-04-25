import type { Turno } from "../models";

export const isTurnoEnCurso = (turno: Turno) => {
  const now = new Date().getTime();

  return now >= new Date(turno.inicioTurno).getTime() && now <= (new Date(turno.inicioTurno).getTime() + (turno.duracionMinutos * 60 * 1000));
}