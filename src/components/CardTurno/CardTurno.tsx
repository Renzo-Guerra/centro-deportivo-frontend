import type { Turno } from "../../models";
import { addDeporteClass, addMinutes, formatDateTime } from "../../utils";
import "./CardTurno.css";

interface Props {
  turno: Turno,
  resaltado?: boolean,
}

export const CardTurno = ({ turno, resaltado = false }: Props) => {
  return (
    <>
      <div className={`card_container ${resaltado ? "card_container--resaltado" : ""}`}>
        <div className="card_container__datos">
          <p className="datos__cliente">{turno.nombreCliente} {turno.apellidoCliente}</p>
          <p className={`datos__cancha ${addDeporteClass(turno)}`}>{turno.deporte.toLowerCase()} - {turno.nombreCancha}</p>
        </div>
        <div className="card_container__horarios">
          <span>{formatDateTime(turno.inicioTurno).split("T")[1]} - {formatDateTime(addMinutes(turno.inicioTurno, turno.duracionMinutos)).split("T")[1]}</span>
          <span>{turno.duracionMinutos} min</span>
        </div>
      </div >
    </>
  )
}