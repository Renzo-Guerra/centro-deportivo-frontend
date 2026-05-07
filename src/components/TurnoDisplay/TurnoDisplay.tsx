import type { ReactNode } from "react";
import type { Turno } from "../../models";
import "./TurnoDisplay.css";
import { addDeporteClass, addMinutes, formatDate, formatDateTime } from "../../utils";

interface Props {
  turno: Turno,
  children?: ReactNode,
}

export const TurnoDisplay = ({ turno, children }: Props) => {
  return (
    <>
      <div className={`turno-display__container ${addDeporteClass(turno)}`}>
        <span className="turno-display__horarios__fecha">{formatDate(turno.inicioTurno)}</span>
        <div className="turno-display__info">
          <div className="turno-display__cliente">
            <p className="turno-display__cliente__nombre">{turno.nombreCliente} {turno.apellidoCliente}</p>
            <p className="turno-display__cliente__cancha">{turno.deporte.toLowerCase()} - {turno.nombreCancha}</p>
            <p className="turno-display__cliente__celular">Cel: {turno.celularCliente}</p>
          </div>
          <div className="turno-display__horarios">
            <span className="turno-display__horarios__horario">{formatDateTime(turno.inicioTurno).split("T")[1]} - {formatDateTime(addMinutes(turno.inicioTurno, turno.duracionMinutos)).split("T")[1]}</span>
            <span className="turno-display__horarios__duracion">{turno.duracionMinutos} min</span>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}