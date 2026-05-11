import { useMemo, useState } from "react";
import { BasicModal, CardTurno, FormTurno, Loading } from "../../components";
import { MetricCard } from "../../components/MetricCard/MetricCard";
import { useFetchAutomatico } from "../../hooks";
import type { Cancha, Turno, turnoValues } from "../../models";
import { getTodayDateLocal, isTurnoEnCurso, isTurnoFinished, mapperTurnoValuesToTurno } from "../../utils";
import "./Dashboard.css";
import { axiosInterceptor } from "../../interceptors";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const { data: turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useFetchAutomatico<Turno[]>(`/turnos/fecha?fecha=${getTodayDateLocal()}&sortBy=inicioTurno`);
  const { data: canchas, isLoading: isLoadingCanchas, error: errorCanchas } = useFetchAutomatico<Cancha[]>(`/canchas/all?sortBy=tipo,asc&sortBy=nombre,asc`);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);

  const turnosEnCurso = useMemo(() => {
    return turnos ? turnos.filter(t => isTurnoEnCurso(t)) : [];
  }, [turnos]);

  const turnosTerminados = useMemo(() => {
    return turnos ? turnos.filter(t => isTurnoFinished(t)) : [];
  }, [turnos]);

  const submitAdd = (data: turnoValues) => {
    const newTurno: Turno = mapperTurnoValuesToTurno(data);

    toast.promise(async () => axiosInterceptor.post("/turnos", newTurno),
      {
        loading: "Enviando",
        success: "Turno creado exitosamente!",
        // No es necesario un error porque axiosInterceptor lo maneja
      }).then(() => {
        setIsModalAddActive(false);
      });
    // No es necesario el catch ya que el axiosInterceptor lo maneja
  }

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
            <button className="btn btn-accent border-radius--500 btn-crear-turno" onClick={() => setIsModalAddActive(true)}>Agregar turno</button>

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
        {isModalAddActive && (
          <BasicModal titulo="Crear turno" closeModal={() => setIsModalAddActive(false)}>
            <FormTurno
              onSubmit={(data: turnoValues) => submitAdd(data)}
              onCancel={() => setIsModalAddActive(false)} />
          </BasicModal>
        )}
      </div>
    </>
  )
}