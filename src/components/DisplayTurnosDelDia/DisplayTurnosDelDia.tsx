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
      {error ? (
        <p>Opps! Hubo un error al cargar los turnos!</p>
      ) : (
        <div className="turnos_container">
          <h2>Turnos del dia</h2>
          {/* En caso de que no haya turnos hoy */}
          {turnos && turnos?.length == 0 && (
            <p>Parece que no tienes ningun turno asignado para hoy...</p>
          )}
          {/* Mostrar turnos */}
          {turnos && turnos.map(turno => (
            <CardTurno key={turno.id} turno={turno} resaltado={isTurnoEnCurso(turno)} />
          ))}
        </div>
      )}
    </>
  )
}