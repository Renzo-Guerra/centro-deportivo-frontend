export interface Cancha {
  id: number,
  nombre: string,
  tipo: "FUTBOL" | "TENIS" | "VOLEY" | "PADEL",
  creacion: Date,
  ultimaActualizacion: Date,
}