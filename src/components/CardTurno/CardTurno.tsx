import type { Turno } from "../../models";
import { addDeporteClass } from "../../utils";
import "./CardTurno.css";

interface Props {
  turno: Turno,
  resaltado?: boolean,
}

export const CardTurno = ({ turno, resaltado = false }: Props) => {
  return (
    <>
      <div className={`card_container ${resaltado ? "card_container--resaltado" : ""}`}>
        <div className={`card_container__deporte ${addDeporteClass(turno)}`} >
          {turno.deporte[0]}
        </div>
        <div className="card_container__datos">
          <p className="datos__cliente">{turno.nombreCliente} {turno.apellidoCliente}</p>
          <p className="datos__cancha">{turno.deporte.toLowerCase()} - {turno.nombreCancha}</p>
        </div>
        <div className="card_container__horarios">
          <span>{new Date(turno.inicioTurno).toLocaleTimeString([], { hour12: false }).split(":").slice(0, 2).join(":")}</span>
          <span>{turno.duracionMinutos} min</span>
        </div>
      </div>
    </>
  )
}