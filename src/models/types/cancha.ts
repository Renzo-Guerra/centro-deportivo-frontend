export const TIPOS_CANCHA_ARRAY = ["FUTBOL", "PADEL", "TENIS", "VOLEY"];

export type Tipos_Cancha = typeof TIPOS_CANCHA_ARRAY[number];

export interface Cancha {
  id: number,
  nombre: string,
  tipo: Tipos_Cancha,
  creacion: Date,
  ultimaActualizacion: Date,
}