import { TIPOS_CANCHA_ARRAY, type Turno, type turnoValues } from "../models";
import { toDateTimeLocal } from "./date.utils";

export const isTurnoEnCurso = (turno: Turno) => {
  const now = new Date().getTime();

  return now >= new Date(turno.inicioTurno).getTime() && now <= (new Date(turno.inicioTurno).getTime() + (turno.duracionTurnoMinutos * 60 * 1000));
}

export const isTurnoFinished = (turno: Turno) => {
  const inicioMs = new Date(turno.inicioTurno).getTime();
  const duracionMs = turno.duracionTurnoMinutos * 60 * 1000;
  const finTurnoMs = inicioMs + duracionMs;

  const ahoraMs = Date.now();

  return ahoraMs > finTurnoMs;
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
    turno.idCancha.toString() === newData.idCancha &&
    toDateTimeLocal(turno.inicioTurno) === toDateTimeLocal(`${newData.diaTurno}T${newData.horarioTurno}`) &&
    turno.duracionTurnoMinutos === newData.duracionTurnoMinutos
  );
}

export const mapperTurnoValuesToTurno = (data: turnoValues): Turno => {
  return {
    id: 0,
    nombreCliente: data.nombreCliente,
    apellidoCliente: data.apellidoCliente,
    celularCliente: data.celularCliente,
    creacionTurno: "",
    idCancha: Number(data.idCancha),
    inicioTurno: data.diaTurno + "T" + data.horarioTurno,
    duracionTurnoMinutos: data.duracionTurnoMinutos,
    nombreCancha: "",
    deporte: TIPOS_CANCHA_ARRAY[0]
  }
}