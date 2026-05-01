import { useEffect, useState } from "react";
import { useFetchManual } from "../../hooks";
import type { Page, Turno } from "../../models";
import "./turnos.page.css";
import { BasicModal, TurnoDisplay } from "../../components";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";

export const TurnosPage = () => {
  const { data: pageTurno, isLoading, error, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);

  useEffect(() => {
    loadTurnos("/turnos", "GET");
  }, []);

  const onClickDelete = (turno: Turno) => {
    setSelectedTurno(turno);
    setIsModalDeleteActive(true);
  }

  const submitDelete = (id: number) => {
    toast.promise(async () => axiosInterceptor.delete("/turnos/" + id),
      {
        loading: "Enviando",
        success: "Turno eliminado exitosamente!",
        error: (err) => err.status != 403 ? err.message : "",
      }).then(() => {
        closeModal();
        loadTurnos("/turnos", "GET");
      }).catch(err => {
        console.error(err);
      });
  }

  const closeModal = () => {
    setSelectedTurno(null);
    setIsModalDeleteActive(false);
  }

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
                <button onClick={() => onClickDelete(turno)}>Eliminar</button>
              </div>
            </TurnoDisplay>
          ))}
        </div>
      )}

      {isModalDeleteActive && (
        <BasicModal>
          <div className="turnos__modal">
            <p>¿Estás seguro que quieres eliminar el turno de "{selectedTurno?.nombreCliente} {selectedTurno?.apellidoCliente}"?</p>
            <div className="turnos__modal__action-buttons">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={() => selectedTurno ? submitDelete(selectedTurno.id) : ""}>Eliminar</button>
            </div>
          </div>
        </BasicModal>
      )}
    </>
  )
}