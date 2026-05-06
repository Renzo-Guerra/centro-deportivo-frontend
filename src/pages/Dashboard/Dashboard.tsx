import { DisplayTurnosDelDia } from "../../components";
import { MetricCard } from "../../components/MetricCard/MetricCard";
import { useFetchAutomatico } from "../../hooks";
import type { Cancha, Page, Turno } from "../../models";
import { getTodayDateLocal, isTurnoEnCurso } from "../../utils";
import "./Dashboard.css";

export const Dashboard = () => {
  const { data: turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useFetchAutomatico<Turno[]>(`/turnos/fecha?fecha=${getTodayDateLocal()}&sortBy=inicioTurno`);
  const { data: pageCancha, isLoading: isLoadingCanchas, error: errorCanchas } = useFetchAutomatico<Page<Cancha>>(`/canchas`);

  const turnosEnCurso = turnos ? turnos.filter(t => isTurnoEnCurso(t)) : [];

  return (
    <>
      {isLoadingTurnos || isLoadingCanchas ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="dashboard__cards-container">
            <div className="dashboard__cards">
              <MetricCard label={"TURNOS HOY"} cantidad={turnos ? turnos.length : 0} />
              <MetricCard label={"EN CURSO"} cantidad={turnosEnCurso.length} />
              {errorCanchas ? (
                <p>Error al cargar las canchas</p>
              ) : (
                <>
                  <MetricCard label={"CANCHAS"} cantidad={pageCancha ? pageCancha.totalElements : 0} />
                  <MetricCard label={"LIBRES"} cantidad={pageCancha ? pageCancha.totalElements - turnosEnCurso.length : 0} />
                </>
              )}
            </div>
          </div>
          <DisplayTurnosDelDia turnos={turnos} error={errorTurnos} />
        </>
      )}
    </>
  )
}