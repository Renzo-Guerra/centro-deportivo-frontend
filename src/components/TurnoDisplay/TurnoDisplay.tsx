import type { ReactNode } from "react";
import type { Turno } from "../../models";
import "./TurnoDisplay.css";
import { addDeporteClass } from "../../utils";

interface Props {
  turno: Turno,
  children?: ReactNode,
}

export const TurnoDisplay = ({ turno, children }: Props) => {
  /**
   * Dada una fecha la parsea para devolver hh-mm
   * @param date Fecha a transformar
   * @returns string hh-mm
   */
  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour12: false }).split(":").slice(0, 2).join(":")
  }

  /**
   * Dada una fecha la parsea para devolver dd-MM-yyyy
   * @param date Fecha a transformar
   * @returns string dd-MM-yyyy
   */
  const formatDate = (date: Date) => {
    let [anio, mes, dia] = date.toISOString().split("T")[0].split("-");

    return `${dia}-${mes}-${anio}`;
  }

  return (
    <>
      <div className={`turno-display__container ${addDeporteClass(turno)}`}>
        <span className="turno-display__horarios__fecha">{formatDate(new Date(turno.inicioTurno))}</span>
        <div className="turno-display__info">
          <div className="turno-display__cliente">
            <p className="turno-display__cliente__nombre">{turno.nombreCliente} {turno.apellidoCliente}</p>
            <p className="turno-display__cliente__cancha">{turno.deporte.toLowerCase()} - {turno.nombreCancha}</p>
          </div>
          <div className="turno-display__horarios">
            <span className="turno-display__horarios__horario">{formatDateTime(new Date(turno.inicioTurno))}</span>
            <span className="turno-display__horarios__duracion">{turno.duracionMinutos} min</span>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}