import type { TiposCancha } from "./cancha";

const DURACION_TURNOS_MINUTOS_FUTBOL: number = 60 as const;
const DURACION_TURNOS_MINUTOS_PADEL: number = 30 as const;
const DURACION_TURNOS_MINUTOS_TENIS: number = 30 as const;
const DURACION_TURNOS_MINUTOS_VOLEY: number = 60 as const;

export const DURACION_TURNOS_MINUTOS_OBJETO = {
  FUTBOL: DURACION_TURNOS_MINUTOS_FUTBOL,
  PADEL: DURACION_TURNOS_MINUTOS_PADEL,
  TENIS: DURACION_TURNOS_MINUTOS_TENIS,
  VOLEY: DURACION_TURNOS_MINUTOS_VOLEY
} as const;

export type DuracionTurnosMinutos = typeof DURACION_TURNOS_MINUTOS_OBJETO[keyof typeof DURACION_TURNOS_MINUTOS_OBJETO];

export interface Turno {
  id: number,
  nombreCliente: string,
  apellidoCliente: string,
  celularCliente: string,
  creacionTurno: Date,
  inicioTurno: Date,
  duracionMinutos: DuracionTurnosMinutos,
  idCancha: number,
  nombreCancha: string,
  deporte: TiposCancha,
}