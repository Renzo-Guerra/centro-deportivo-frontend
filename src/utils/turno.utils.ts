import type { Turno } from "../models";

export const isTurnoEnCurso = (turno: Turno) => {
  const now = new Date().getTime();

  return now >= new Date(turno.inicioTurno).getTime() && now <= (new Date(turno.inicioTurno).getTime() + (turno.duracionMinutos * 60 * 1000));
}

export const addDeporteClass = (turno: Turno) => {
  switch (turno.deporte) {
    case "FUTBOL": return "futbol";
    case "VOLEY": return "voley";
    case "TENIS": return "tenis";
    case "PADEL": return "padel";
    default: return "";
  }
}