import type { Turno, turnoValues } from "../models";
import { formatDateTime } from "./date.utils";

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

export const hasSameValues = (turno: Turno | null, newData: turnoValues) => {
  return (
    turno &&
    turno.nombreCliente === newData.nombreCliente &&
    turno.apellidoCliente === newData.apellidoCliente &&
    turno.celularCliente === newData.celularCliente &&
    turno.deporte === newData.deporte &&
    turno.idCancha.toString() === newData.idCancha &&
    formatDateTime(turno.inicioTurno) === formatDateTime(newData.inicioTurno) &&
    turno.duracionMinutos === newData.duracionTurnoMinutos
  );
}