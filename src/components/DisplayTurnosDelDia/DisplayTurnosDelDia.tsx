import { useFetchAutomatico } from "../../hooks";
import type { Turno } from "../../models/types/turno";
import { CardTurno } from "../CardTurno/CardTurno";
import "./DisplayTurnosDelDia.css";

export const DisplayTurnosDelDia = () => {
  const hoy = new Date().toISOString().split("T")[0];
  const { data: turnos, isLoading, error } = useFetchAutomatico<Turno[]>(`/turnos/fecha?fecha=${hoy}`);

  return (
    <>
      {isLoading && <p>Cargando turnos del día...</p>}

      {error && <p>Opps! Hubo un error al cargar los turnos!</p>}

      <div className="turnos_container">
        <h2>Turnos del dia</h2>
        {/* En caso de que no haya turnos hoy */}
        {!isLoading && turnos && turnos?.length == 0 && (
          <p>Parece que no tienes ningun turno asignado para hoy...</p>
        )}
        {/* Mostrar turnos */}
        {!isLoading && turnos && turnos.map(turno => (
          <CardTurno key={turno.id} turno={turno} />
        ))}
      </div>
    </>
  )
}