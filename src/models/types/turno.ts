export interface Turno {
  id: number,
  nombreCliente: string,
  apellidoCliente: string,
  celularCliente: string,
  creacionTurno: Date,
  inicioTurno: Date,
  duracionMinutos: number,
  idCancha: number,
  nombreCancha: string,
  deporte: string,
}