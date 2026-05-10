import { DURACION_TURNOS_MINUTOS_OBJETO, type Cancha, type Turno } from "../../models";
import { addMinutes, formatDateTime } from "../../utils";
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
  const inicio = new Date();
  inicio.setHours(9);
  inicio.setMinutes(0);
  inicio.setSeconds(0);
  inicio.setMilliseconds(0);

  const fin = new Date();
  fin.setHours(24);
  fin.setMinutes(0);
  fin.setSeconds(0);
  fin.setMilliseconds(0);

  let diferenciaEnMinutos = (fin.getTime() - inicio.getTime()) / 1000 / 60;
  // Turnos disponibles
  const cantTurnosPosibles = Math.floor(diferenciaEnMinutos / DURACION_TURNOS_MINUTOS_OBJETO[cancha.tipo]);

  const posiblesHorarios: string[] = [];

  for (let index = 0; index < cantTurnosPosibles; index++) {
    posiblesHorarios.push(addMinutes(inicio, (index * DURACION_TURNOS_MINUTOS_OBJETO[cancha.tipo])))
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
            <div key={currHorario.toString()}>
              <input
                className={`hidden ${isSelected} ? "horario--selected" : ""}`}
                readOnly={true}
                checked={isSelected}
                type="radio"
                name="horario"
                value={`${cancha.id},${horario}`} />

              <button
                className={`btn btn-primary border-radius--500 turnos-disponibles__horario`}
                disabled={filteredTurnos.some(currTurno => {
                  const mismoHorario = horario === formatDateTime(currTurno.inicioTurno).split("T")[1];

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