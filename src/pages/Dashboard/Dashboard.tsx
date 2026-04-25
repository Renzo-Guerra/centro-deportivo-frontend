import { DisplayTurnosDelDia } from "../../components";
import { MetricCard } from "../../components/CustomComponent/MetricCard";
import { useFetchAutomatico } from "../../hooks";
import type { Cancha } from "../../models/types/cancha";
import type { Page } from "../../models/types/page";
import type { Turno } from "../../models/types/turno";
import "./Dashboard.css";

const Dashboard = () => {
  const hoy = new Date().toISOString().split("T")[0];
  const { data: turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useFetchAutomatico<Turno[]>(`/turnos/fecha?fecha=${hoy}&sortBy=inicioTurno`);
  const { data: pageCancha, isLoading: isLoadingCanchas, error: errorCanchas } = useFetchAutomatico<Page<Cancha>>(`/canchas`);

  const isTurnoEnCurso = (turno: Turno) => {
    const now = new Date().getTime();

    return now >= new Date(turno.inicioTurno).getTime() && now <= (new Date(turno.inicioTurno).getTime() + (turno.duracionMinutos * 60 * 1000));
  }

  const turnosEnCurso = turnos ? turnos.filter(t => isTurnoEnCurso(t)) : [];

  return (
    <>
      {isLoadingTurnos || isLoadingCanchas && (
        <p>Cargando...</p>
      )}

      {!isLoadingTurnos && !isLoadingCanchas && (
        <>
          <div className="dashboard__cards-container">
            <div className="dashboard__cards">
              <MetricCard label={"TURNOS HOY"} cantidad={turnos ? turnos.length : 0} />
              <MetricCard label={"EN CURSO"} cantidad={turnosEnCurso.length} />
              {errorCanchas && (
                <p>Error al cargar las canchas</p>
              )}
              {!errorCanchas && (
                <>
                  <MetricCard label={"LIBRES"} cantidad={pageCancha ? pageCancha.totalElements - turnosEnCurso.length : 0} />
                  <MetricCard label={"CANCHAS"} cantidad={pageCancha ? pageCancha.totalElements : 0} />
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

export default Dashboard;