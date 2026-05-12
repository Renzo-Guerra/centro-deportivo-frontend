import type { ReactNode } from "react";
import type { Turno } from "../../models";
import "./TurnoDisplay.css";
import { addDeporteClass, addMinutes, formatArg } from "../../utils";

interface Props {
  turno: Turno,
  children?: ReactNode,
}

export const TurnoDisplay = ({ turno, children }: Props) => {
  return (
    <>
      <div className={`turno-display__container`}>
        <span className="turno-display__horarios__fecha">{formatArg(turno.inicioTurno, "dddd-MM-yyyy")}</span>
        <div className="turno-display__info">
          <div className="turno-display__cliente">
            <p className="turno-display__cliente__nombre">{turno.nombreCliente} {turno.apellidoCliente}</p>
            <p className="turno-display__cliente__cancha"><span className={addDeporteClass(turno)}>{turno.deporte.toLowerCase()}</span> - {turno.nombreCancha}</p>
            <p className="turno-display__cliente__celular">Cel: {turno.celularCliente}</p>
          </div>
          <div className="turno-display__horarios">
            <span className="turno-display__horarios__horario">{formatArg(turno.inicioTurno, "HH:mm")} - {formatArg(addMinutes(turno.inicioTurno, turno.duracionTurnoMinutos), "HH:mm")}</span>
            <span className="turno-display__horarios__duracion">{turno.duracionTurnoMinutos} min</span>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}