import type { Turno } from "../../models";
import { addDeporteClass, addMinutes, formatArg } from "../../utils";
import "./CardTurno.css";

interface Props {
  turno: Turno,
  resaltado?: boolean,
}

export const CardTurno = ({ turno, resaltado = false }: Props) => {
  return (
    <>
      <div className={`card_container ${resaltado ? "card_container--resaltado" : ""}`}>
        <div className={`card_container__datos`}>
          <p className="datos__cliente">{turno.nombreCliente} {turno.apellidoCliente}</p>
          <p className={`datos__cancha`}><span className={`${addDeporteClass(turno)}`}>{turno.deporte.toLowerCase()}</span> - {turno.nombreCancha}</p>
        </div>
        <div className="card_container__horarios">
          <span>{formatArg(turno.inicioTurno, "HH:mm")} - {formatArg(addMinutes(turno.inicioTurno, turno.duracionTurnoMinutos), "HH:mm")}</span>
          <span>{turno.duracionTurnoMinutos} min</span>
        </div>
      </div >
    </>
  )
}