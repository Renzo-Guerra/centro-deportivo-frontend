import { useEffect, useState } from "react";
import { CanchaDisplay, BasicModal } from "../../components";
import { useFetchManual } from "../../hooks";
import type { Cancha, canchaValues, Page } from "../../models";
import "./Canchas.page.css";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { FormCancha } from "../../components/FormCancha/FormCancha";

export const CanchasPage = () => {
  const { data: pageCancha, isLoading, error, submitRequest: loadCanchas } = useFetchManual<Page<Cancha>>();
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);
  const [isModalEditActive, setIsModalEditActive] = useState<boolean>(false);

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
  }

  return (
    <>
      {isLoading && (
        <p>Cargando canchas...</p>
      )}

      {!isLoading && error && (
        <p>{error.message}</p>
      )}
      <button className="canchas_page__agregarCanchaBtn" onClick={() => setIsModalAddActive(true)}>Agregar cancha</button>
      {!isLoading && !error && (
        <div className="canchas-container">
          {pageCancha?.totalElements == 0 && (
            <p>Parece que no hay canchas cargadas al sistema!</p>
          )}
          {pageCancha?.content.map(cancha => (
            <CanchaDisplay key={cancha.id} cancha={cancha} >
              <div className="canchas__action-buttons">
                <button onClick={() => onClickDelete(cancha)}>Eliminar</button>
                <button onClick={() => onClickEdit(cancha)}>Editar</button>
              </div>
            </CanchaDisplay>
          ))}

          {isModalDeleteActive && (
            <BasicModal>
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
        <BasicModal>
          <FormCancha
            onSubmit={(data: canchaValues) => submitAdd(data)}
            onCancel={closeModal} />
        </BasicModal>
      )}
      {isModalEditActive && (
        <BasicModal>
          <FormCancha
            cancha={selectedCancha}
            onSubmit={(data: canchaValues) => submitEdit(data)}
            onCancel={closeModal} />
        </BasicModal>
      )}
    </>
  )
}