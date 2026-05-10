import { useMemo } from "react";
import { CardTurno, Loading } from "../../components";
import { MetricCard } from "../../components/MetricCard/MetricCard";
import { useFetchAutomatico } from "../../hooks";
import type { Cancha, Turno } from "../../models";
import { getTodayDateLocal, isTurnoEnCurso, isTurnoFinished } from "../../utils";
import "./Dashboard.css";

export const Dashboard = () => {
  const { data: turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useFetchAutomatico<Turno[]>(`/turnos/fecha?fecha=${getTodayDateLocal()}&sortBy=inicioTurno`);
  const { data: canchas, isLoading: isLoadingCanchas, error: errorCanchas } = useFetchAutomatico<Cancha[]>(`/canchas/all?sortBy=tipo,asc&sortBy=nombre,asc`);

  const turnosEnCurso = useMemo(() => {
    return turnos ? turnos.filter(t => isTurnoEnCurso(t)) : [];
  }, [turnos]);

  const turnosTerminados = useMemo(() => {
    return turnos ? turnos.filter(t => isTurnoFinished(t)) : [];
  }, [turnos]);

  return (
    <>
      <div className="page-container">
        {isLoadingTurnos || isLoadingCanchas && (
          <Loading mensaje="Cargando dashboard" />
        )}

        {!isLoadingTurnos && !isLoadingCanchas && (
          <>
            <div className="dashboard__cards-container">
              <MetricCard label={"TURNOS HOY"} cantidad={turnos ? turnos.length : 0} />
              <MetricCard label={"TURNOS EN CURSO"} cantidad={turnosEnCurso.length} />
              {errorCanchas && (
                <p>Error al cargar las canchas</p>
              )}
              {!errorCanchas && (
                <>
                  <MetricCard label={"TURNOS TERMINADOS"} cantidad={turnosTerminados.length} />
                  <MetricCard label={"CANCHAS LIBRES"} cantidad={canchas ? (canchas.length - turnosEnCurso.length) : 0} />
                </>
              )}
            </div>
            <div className="dashboard__summary-container">
              <div className="dashboard__summary__turnos-del-dia">
                <h2>Turnos del dia</h2>
                {errorTurnos && (
                  <p>Opps! Hubo un error al cargar los turnos!</p>
                )}

                {!errorTurnos && turnos && turnos.length == 0 && (
                  <p>Parece que no tienes ningun turno asignado para hoy...</p>
                )}

                {!errorTurnos && turnos && turnos.length > 0 && (
                  <div className="dashboard__summary__turnos-container">
                    {turnos.map(turno => (
                      <CardTurno key={turno.id} turno={turno} resaltado={isTurnoEnCurso(turno)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}