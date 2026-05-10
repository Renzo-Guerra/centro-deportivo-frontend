import { useMemo } from "react";
import { DisplayTurnosDelDia, Loading } from "../../components";
import { MetricCard } from "../../components/MetricCard/MetricCard";
import { useFetchAutomatico } from "../../hooks";
import type { Cancha, Page, Turno } from "../../models";
import { getTodayDateLocal, isTurnoEnCurso, isTurnoFinished } from "../../utils";
import "./Dashboard.css";

export const Dashboard = () => {
  const { data: turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useFetchAutomatico<Turno[]>(`/turnos/fecha?fecha=${getTodayDateLocal()}&sortBy=inicioTurno`);
  const { data: pageCancha, isLoading: isLoadingCanchas, error: errorCanchas } = useFetchAutomatico<Page<Cancha>>(`/canchas`);

  const turnosEnCurso = useMemo(() => {
    return turnos ? turnos.filter(t => isTurnoEnCurso(t)) : [];
  }, [turnos]);

  const turnosTerminados = useMemo(() => {
    return turnos ? turnos.filter(t => isTurnoFinished(t)) : [];
  }, [turnos]);

  return (
    <>
      <div className="page-container">
        {isLoadingTurnos || isLoadingCanchas ? (
          <Loading mensaje="Cargando dashboard" />
        ) : (
          <>
            <div className="dashboard__cards-container">
              <MetricCard label={"TURNOS HOY"} cantidad={turnos ? turnos.length : 0} />
              <MetricCard label={"TURNOS EN CURSO"} cantidad={turnosEnCurso.length} />
              {errorCanchas ? (
                <p>Error al cargar las canchas</p>
              ) : (
                <>
                  <MetricCard label={"TURNOS TERMINADOS"} cantidad={turnosTerminados.length} />
                  <MetricCard label={"CANCHAS LIBRES"} cantidad={pageCancha ? pageCancha.totalElements - turnosEnCurso.length : 0} />
                </>
              )}
            </div>
            <DisplayTurnosDelDia turnos={turnos} error={errorTurnos} />
          </>
        )}
      </div>
    </>
  )
}