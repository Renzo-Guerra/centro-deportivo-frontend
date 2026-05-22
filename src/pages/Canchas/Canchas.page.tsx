import { useEffect, useState } from "react";
import { CanchaDisplay, BasicModal, TurnoDisplay, Loading, PageableFooter } from "../../components";
import { useFetchManual } from "../../hooks";
import type { Cancha, canchaValues, Page, Turno } from "../../models";
import "./Canchas.page.css";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { FormCancha } from "../../components/FormCancha/FormCancha";

export const CanchasPage = () => {
  const { data: pageCancha, isLoading: isLoadingCanchas, error: errorCanchas, submitRequest: loadCanchas } = useFetchManual<Page<Cancha>>();
  const { data: pageTurno, isLoading: isLoadingTurnos, error: errorTurnos, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();

  const pageSize = 5;

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
    loadTurnos(`/canchas/${cancha.id}/turnos?pageNo=0&pageSize=${pageSize}&sortBy=inicioTurno`);
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
      toast.error("Primero debe editar los datos!");
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

  const traerPaginaAnterior = () => {
    if (!pageTurno || pageTurno.pageSize == 1 || pageTurno.pageNo == 0) {
      return;
    }

    loadTurnos(`/canchas/${selectedCancha?.id}/turnos?pageNo=${pageTurno.pageNo - 1}&pageSize=${pageSize}&sortBy=inicioTurno`);
  }

  const traerPaginaSiguiente = () => {
    if (!pageTurno || pageTurno.pageSize == 0 || pageTurno.last) {
      return;
    }

    loadTurnos(`/canchas/${selectedCancha?.id}/turnos?pageNo=${pageTurno.pageNo + 1}&pageSize=${pageSize}&sortBy=inicioTurno`);
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
      <div className="page-container">
        {isLoadingCanchas && (
          <Loading mensaje="Cargando canchas..." />
        )}

        {!isLoadingCanchas && errorCanchas && (
          <p>{errorCanchas.message}</p>
        )}
        {!isLoadingCanchas && !errorCanchas && (
          <>
            <button className="btn btn-accent border-radius--500 btn-crear-cancha" onClick={() => setIsModalAddActive(true)}>Agregar cancha</button>
            <div className="canchas-container">
              {pageCancha?.totalElements == 0 && (
                <p>Parece que no hay canchas cargadas al sistema!</p>
              )}
              {pageCancha?.content.map(cancha => (
                <CanchaDisplay key={cancha.id} cancha={cancha} >
                  <div className="canchas-page__action-buttons">
                    <button className="btn btn-accent border-radius--500" onClick={() => onClickVerTurnos(cancha)}>Turnos</button>
                    <button className="btn btn-secondary border-radius--500" onClick={() => onClickEdit(cancha)}>Editar</button>
                    <button className="btn btn-danger border-radius--500" onClick={() => onClickDelete(cancha)}>Eliminar</button>
                  </div>
                </CanchaDisplay>
              ))}

              {isModalDeleteActive && (
                <BasicModal titulo="Eliminar cancha" closeModal={closeModal}>
                  <div className="canchas__modal">
                    <p>¿Estás seguro que quieres eliminar la cancha "{selectedCancha?.nombre}"?</p>
                    <div className="canchas__modal__action-buttons">
                      <button className="btn btn-secondary border-radius--500" onClick={closeModal}>Cancelar</button>
                      <button className="btn btn-danger border-radius--500" onClick={() => selectedCancha ? submitDelete(selectedCancha.id) : ""}>Eliminar</button>
                    </div>
                  </div>
                </BasicModal>
              )}
            </div>
          </>
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

        {isModalTurnosActive && (
          <BasicModal titulo="Turnos" closeModal={closeModal}>
            <>
              <div className="modal__canchaTurnos">
                {isLoadingTurnos && (
                  <Loading mensaje="Cargando turnos..." />
                )}

                {errorTurnos && (
                  <p>Opps! Error en el servidor, verificar la consola</p>
                )}

                {!isLoadingTurnos && pageTurno && pageTurno.totalElements == 0 && (
                  <p>Parece que la cancha no tiene turnos asignados!</p>
                )}

                {!isLoadingTurnos && pageTurno && pageTurno.totalElements > 0 && (
                  <>
                    {pageTurno?.content.map(turno => (
                      <TurnoDisplay key={turno.id} turno={turno} />
                    ))}
                    <PageableFooter
                      page={pageTurno}
                      onNext={traerPaginaAnterior}
                      onPrevious={traerPaginaSiguiente} />
                  </>
                )}
              </div>
            </>
          </BasicModal>
        )}
      </div>
    </>
  )
}