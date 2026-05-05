import { useEffect, useState } from "react";
import { CanchaDisplay, BasicModal, TurnoDisplay } from "../../components";
import { useFetchManual } from "../../hooks";
import type { Cancha, canchaValues, Page, Turno } from "../../models";
import "./Canchas.page.css";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { FormCancha } from "../../components/FormCancha/FormCancha";

export const CanchasPage = () => {
  const { data: pageCancha, isLoading: isLoadingCanchas, error: errorCanchas, submitRequest: loadCanchas } = useFetchManual<Page<Cancha>>();
  const { data: pageTurno, isLoading: isLoadingTurnos, error: errorTurnos, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();

  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);
  const [isModalEditActive, setIsModalEditActive] = useState<boolean>(false);
  const [isModalTurnosActive, setIsModalTurnosActive] = useState<boolean>(false);

  useEffect(() => {
    loadCanchas("/canchas", "GET");
  }, []);

  const onClickDelete = (cancha: Cancha) => {
    setSelectedCancha(cancha);
    setIsModalDeleteActive(true);
  }

  const onClickEdit = (cancha: Cancha) => {
    setSelectedCancha(cancha);
    setIsModalEditActive(true);
  }
  const onClickVerTurnos = (cancha: Cancha) => {
    setSelectedCancha(cancha);
    setIsModalTurnosActive(true);
    loadTurnos(`/canchas/${cancha.id}/turnos?pageNo=0&pageSize=5&sortBy=inicioTurno`);
  }

  const submitDelete = (idCancha: number) => {
    toast.promise(async () => axiosInterceptor.delete("/canchas/" + idCancha),
      {
        loading: "Enviando",
        success: "Cancha eliminada exitosamente!",
      }).then(() => {
        closeModal();
        loadCanchas("/canchas", "GET");
      });
  }

  const submitAdd = (data: canchaValues) => {
    toast.promise(async () => axiosInterceptor.post("/canchas", data),
      {
        loading: "Enviando",
        success: "Cancha creada exitosamente!",
      }).then(() => {
        closeModal();
        loadCanchas("/canchas", "GET");
      });
  }

  const hasSameValues = (cancha: Cancha | null, newData: canchaValues) => {
    return (
      cancha &&
      cancha.nombre === newData.nombre &&
      cancha.tipo === newData.tipo
    );
  }

  const submitEdit = (data: canchaValues) => {
    // Fast ending en caso de que no se hayan editado los valores
    if (hasSameValues(selectedCancha, data)) {
      toast.success("Cancha editada exitosamente!");
      closeModal();
      return;
    }

    toast.promise(async () => axiosInterceptor.put("/canchas/" + selectedCancha?.id, data),
      {
        loading: "Enviando",
        success: "Cancha editada exitosamente!",
      }).then(() => {
        closeModal();
        loadCanchas("/canchas", "GET");
      });
  }

  const closeModal = () => {
    setSelectedCancha(null);
    setIsModalAddActive(false);
    setIsModalDeleteActive(false);
    setIsModalEditActive(false);
    setIsModalTurnosActive(false);
  }

  return (
    <>
      {isLoadingCanchas && (
        <p>Cargando canchas...</p>
      )}

      {!isLoadingCanchas && errorCanchas && (
        <p>{errorCanchas.message}</p>
      )}
      <button className="canchas_page__agregarCanchaBtn" onClick={() => setIsModalAddActive(true)}>Agregar cancha</button>
      {!isLoadingCanchas && !errorCanchas && (
        <div className="canchas-container">
          {pageCancha?.totalElements == 0 && (
            <p>Parece que no hay canchas cargadas al sistema!</p>
          )}
          {pageCancha?.content.map(cancha => (
            <CanchaDisplay key={cancha.id} cancha={cancha} >
              <div className="canchas__action-buttons">
                <button onClick={() => onClickVerTurnos(cancha)}>Turnos</button>
                <button onClick={() => onClickEdit(cancha)}>Editar</button>
                <button onClick={() => onClickDelete(cancha)}>Eliminar</button>
              </div>
            </CanchaDisplay>
          ))}

          {isModalDeleteActive && (
            <BasicModal titulo="Eliminar cancha" closeModal={closeModal}>
              <div className="canchas__modal">
                <p>¿Estás seguro que quieres eliminar la cancha "{selectedCancha?.nombre}"?</p>
                <div className="canchas__modal__action-buttons">
                  <button onClick={closeModal}>Cancelar</button>
                  <button onClick={() => selectedCancha ? submitDelete(selectedCancha.id) : ""}>Eliminar</button>
                </div>
              </div>
            </BasicModal>
          )}
        </div>
      )}

      {isModalAddActive && (
        <BasicModal titulo="Agregar cancha" closeModal={closeModal}>
          <FormCancha
            onSubmit={(data: canchaValues) => submitAdd(data)}
            onCancel={closeModal} />
        </BasicModal>
      )}

      {isModalEditActive && (
        <BasicModal titulo="Editar cancha" closeModal={closeModal}>
          <FormCancha
            cancha={selectedCancha}
            onSubmit={(data: canchaValues) => submitEdit(data)}
            onCancel={closeModal} />
        </BasicModal>
      )}

      {
        /* 
          TODO: 
          Implementar en el backend GET: canchas/{id}/turnos que devuelva un pageable de turnos
          * Ver el manejo de errores al fallar la peticion dentro de BasicModal...
          * Vale la pena crear otro componente? 
        */
      }
      {isModalTurnosActive && (
        <BasicModal titulo="Turnos" closeModal={closeModal}>
          <>
            <div className="modal__canchaTurnos">
              {isLoadingTurnos && (
                <p>Cargando...</p>
              )}

              {errorTurnos && (
                <p>Opps! Error en el servidor, verificar la consola</p>
              )}

              {pageTurno && pageTurno.totalElements == 0 && (
                <p>Parece que la cancha no tiene turnos asignados!</p>
              )}

              {pageTurno && pageTurno.totalElements > 0 && (
                <>
                  {pageTurno?.content.map(turno => (
                    <TurnoDisplay turno={turno}>
                    </TurnoDisplay>
                  ))}

                  {pageTurno.totalPages > 1 && (
                    <div>
                      {pageTurno.pageNo > 0 && (
                        <button>Anterior</button>
                      )}
                      {pageTurno.pageNo > 0 && (
                        <button>Siguiente</button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        </BasicModal>
      )}
    </>
  )
}