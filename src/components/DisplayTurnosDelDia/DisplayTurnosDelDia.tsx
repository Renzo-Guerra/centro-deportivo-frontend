import type { AxiosError } from "axios";
import { CardTurno } from "../CardTurno/CardTurno";
import "./DisplayTurnosDelDia.css";
import { isTurnoEnCurso } from "../../utils";
import type { Turno } from "../../models";

interface Props {
  turnos: Turno[] | null,
  error: AxiosError<unknown, any> | null,
}

export const DisplayTurnosDelDia = ({ turnos, error }: Props) => {
  return (
    <>
      <div className="turnos-del-dia">
        <h2>Turnos del dia</h2>
        {error && (
          <p>Opps! Hubo un error al cargar los turnos!</p>
        )}

        {!error && turnos && turnos.length == 0 && (
          <p>Parece que no tienes ningun turno asignado para hoy...</p>
        )}

        {!error && turnos && turnos.length > 0 && (
          <div className="turnos-del-dia__turnos-container">
            {turnos.map(turno => (
              <CardTurno key={turno.id} turno={turno} resaltado={isTurnoEnCurso(turno)} />
            ))}
          </div>
        )}

      </div>
    </>
  )
}