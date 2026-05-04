import { useEffect, useState } from "react";
import { useFetchManual } from "../../hooks";
import type { Page, Turno, turnoValues } from "../../models";
import "./turnos.page.css";
import { BasicModal, FormTurno, TurnoDisplay } from "../../components";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { formatDateTime } from "../../utils";

export const TurnosPage = () => {
  const { data: pageTurno, isLoading, error, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);
  const [isModalEditActive, setIsModalEditActive] = useState<boolean>(false);

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
      }).then(() => {
        closeModal();
        loadTurnos("/turnos", "GET");
      });
  }

  const onClickEdit = (turno: Turno) => {
    setSelectedTurno(turno);
    setIsModalEditActive(true);
  }

  const hasSameValues = (turno: Turno | null, newData: turnoValues) => {
    return (
      turno &&
      turno.nombreCliente === newData.nombreCliente &&
      turno.apellidoCliente === newData.apellidoCliente &&
      turno.celularCliente === newData.celularCliente &&
      turno.deporte === newData.deporte &&
      turno.idCancha.toString() === newData.idCancha &&
      formatDateTime(turno.inicioTurno) === newData.inicioTurno &&
      turno.duracionMinutos === newData.duracionTurnoMinutos
    );
  }

  const submitEdit = (data: turnoValues) => {
    // Fast ending en caso de que no se hayan editado los valores
    if (hasSameValues(selectedTurno, data)) {
      toast.error("Primero debe editar los datos!");
      return;
    }


    toast.promise(async () => axiosInterceptor.put("/turnos/" + selectedTurno?.id, data),
      {
        loading: "Enviando",
        success: "Turno editado exitosamente!",
      }).then(() => {
        closeModal();
        loadTurnos("/turnos", "GET");
      });
  }

  const submitAdd = (data: turnoValues) => {
    // TODO: El turno se crea, pero el problema es si se superpone con otros turnos...
    toast.promise(async () => axiosInterceptor.post("/turnos", data),
      {
        loading: "Enviando",
        success: "Turno creado exitosamente!",
        // No es necesario un error porque axiosInterceptor lo maneja
      }).then(() => {
        closeModal();
        loadTurnos("/turnos", "GET");
      });
    // No es necesario el catch ya que el axiosInterceptor lo maneja
  }

  const closeModal = () => {
    setSelectedTurno(null);
    setIsModalAddActive(false);
    setIsModalDeleteActive(false);
    setIsModalEditActive(false);
  }

  return (
    <>
      {isLoading && (
        <p>Cargando Turnos...</p>
      )}

      {!isLoading && error && (
        <p>{error.message}</p>
      )}
      <button className="turnos_page__agregarCanchaBtn" onClick={() => setIsModalAddActive(true)}>Agregar turno</button>
      {!isLoading && !error && (
        <div className="turnos-container">
          {pageTurno?.totalElements == 0 && (
            <p>Parece que no hay turnos cargados en el sistema!</p>
          )}
          {pageTurno?.content.map(turno => (
            <TurnoDisplay key={turno.id} turno={turno} >
              <div className="turnos-page__action-buttons">
                <button onClick={() => onClickEdit(turno)}>Editar</button>
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

      {isModalAddActive && (
        <BasicModal>
          <FormTurno
            onSubmit={(data: turnoValues) => submitAdd(data)}
            onCancel={closeModal} />
        </BasicModal>
      )}

      {isModalEditActive && (
        <BasicModal>
          <FormTurno
            turno={selectedTurno}
            onSubmit={(data: turnoValues) => submitEdit(data)}
            onCancel={closeModal} />
        </BasicModal>
      )}
    </>
  )
}