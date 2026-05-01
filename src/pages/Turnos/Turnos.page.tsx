import { useEffect } from "react";
import { useFetchManual } from "../../hooks";
import type { Page, Turno } from "../../models";
import "./turnos.page.css";
import { TurnoDisplay } from "../../components";

export const TurnosPage = () => {
  const { data: pageTurno, isLoading, error, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();

  useEffect(() => {
    loadTurnos("/turnos", "GET");
  }, []);


  return (
    <>
      {isLoading && (
        <p>Cargando Turnos...</p>
      )}

      {!isLoading && error && (
        <p>{error.message}</p>
      )}

      {!isLoading && !error && (
        <div className="turnos-container">
          {pageTurno?.totalElements == 0 && (
            <p>Parece que no hay turnos cargados en el sistema!</p>
          )}
          {pageTurno?.content.map(turno => (
            <TurnoDisplay key={turno.id} turno={turno} >
              <div className="turnos-page__action-buttons">
                <button>Info</button>
                <button>Editar</button>
                <button>Eliminar</button>
              </div>
            </TurnoDisplay>
          ))}
        </div>
      )}
    </>
  )
}