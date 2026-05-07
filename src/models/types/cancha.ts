export const TIPOS_CANCHA_ARRAY = ["FUTBOL", "PADEL", "TENIS", "VOLEY"] as const;

export type TiposCancha = typeof TIPOS_CANCHA_ARRAY[number];

export interface Cancha {
  id: number,
  nombre: string,
  tipo: TiposCancha,
  creacion: Date,
  ultimaActualizacion: Date,
}