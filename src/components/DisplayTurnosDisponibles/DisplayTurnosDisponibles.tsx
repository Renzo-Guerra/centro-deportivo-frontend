import { DURACION_TURNOS_MINUTOS_OBJETO, FIN_HORARIO_JORNADA, INICIO_HORARIO_JORNADA, type Cancha, type Turno } from "../../models";
import { addMinutes, diffMinutes, formatArg } from "../../utils";
import "./displayTurnosDisponibles.css";

interface Props {
  cancha: Cancha,
  selectedHorario: string,
  idSelectedCancha: string,
  idSelectedTurno?: string,
  turnos: Turno[],
  onClick: (idCancha: string | number, horarioSeleccionado: string) => void,
}

export const DisplayTurnosDisponibles = ({ cancha, idSelectedCancha, selectedHorario, turnos, idSelectedTurno = "", onClick }: Props) => {
  let diferenciaEnMinutos = diffMinutes(INICIO_HORARIO_JORNADA, FIN_HORARIO_JORNADA);
  // Turnos disponibles
  const cantTurnosPosibles = Math.floor(diferenciaEnMinutos / DURACION_TURNOS_MINUTOS_OBJETO[cancha.tipo]);

  const posiblesHorarios: string[] = [];

  for (let index = 0; index < cantTurnosPosibles; index++) {
    posiblesHorarios.push(addMinutes(INICIO_HORARIO_JORNADA, (index * DURACION_TURNOS_MINUTOS_OBJETO[cancha.tipo])))
  }

  const filteredTurnos = turnos.filter(t => t.idCancha === cancha.id);

  return (
    <div>
      <p>{cancha.nombre}</p>
      <div className="turnos-disponibles__container">
        {posiblesHorarios.map(currHorario => {
          const horario = currHorario.split("T")[1];
          const isSelected = selectedHorario == horario && idSelectedCancha == String(cancha.id);

          return (
            <div key={currHorario}>
              <input
                className={`hidden ${isSelected ? "horario--selected" : ""}`}
                readOnly={true}
                checked={isSelected}
                type="radio"
                name="horario"
                value={`${cancha.id},${horario}`} />

              <button
                className={`btn btn-primary border-radius--500 turnos-disponibles__horario`}
                disabled={filteredTurnos.some(currTurno => {
                  const mismoHorario = horario === formatArg(currTurno.inicioTurno, "HH:mm");

                  // El botón se deshabilita si coincide el horario Y NO es el turno que estamos editando.
                  return mismoHorario && String(currTurno.id) !== idSelectedTurno;
                })}
                onClick={() => onClick(cancha.id, horario)}
                type="button"
              >{horario}</button>
            </div>
          )
        })}
      </div>

    </div >

  )
}