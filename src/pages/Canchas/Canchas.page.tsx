import { useEffect, useState } from "react";
import { CanchaDisplay, BasicModal } from "../../components";
import { useFetchManual } from "../../hooks";
import type { Cancha, canchaValues, Page } from "../../models";
import "./Canchas.page.css";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { FormCancha } from "../../components/FormCancha/FormCancha";
import type { AxiosError } from "axios";

export const CanchasPage = () => {
  const { data: pageCancha, isLoading, error, submitRequest: loadCanchas } = useFetchManual<Page<Cancha>>();
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);

  useEffect(() => {
    loadCanchas("/canchas", "get");
  }, []);

  const handleDelete = (cancha: Cancha) => {
    setSelectedCancha(cancha);
  }

  const submitDelete = (idCancha: number) => {
    toast.promise(async () => axiosInterceptor.delete("/canchas/" + idCancha),
      {
        loading: "Enviando",
        success: "Cancha eliminada exitosamente!",
        error: (err) => err.status == 409 ? "Error: La cancha tiene turnos asignados para el futuro!" : "Opps: Error en el servidor, revise la consola!",
      }).then(() => {
        closeModal();
        loadCanchas("/canchas", "get");
      }).catch(err => {
        console.error(err);
      });
  }

  const submitAdd = (data: canchaValues) => {
    console.log(data);

    toast.promise(async () => axiosInterceptor.post("/canchas", data),
      {
        loading: "Enviando",
        success: "Cancha creada exitosamente!",
        error: (err) => {
          switch (err.status) {
            case 409: return "Error: La cancha tiene turnos asignados para el futuro!";
            case 400: return `Error: `;
            default: return "Opps: Error en el servidor, revise la consola!";
          }
        }
      }).then(() => {
        closeModal();
        loadCanchas("/canchas", "get");
      }).catch((err: AxiosError) => {
        console.error(err.message);
      });
  }

  const closeModal = () => {
    setSelectedCancha(null);
    setIsModalAddActive(false);
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
                <button onClick={() => handleDelete(cancha)}>Eliminar</button>
                <button>Editar</button>
              </div>
            </CanchaDisplay>
          ))}
          {selectedCancha && (
            <BasicModal>
              <div className="canchas__modal">
                <p>¿Estás seguro que quieres eliminar la cancha "{selectedCancha.nombre}"?</p>
                <div className="canchas__modal__action-buttons">
                  <button onClick={closeModal}>Cancelar</button>
                  <button onClick={() => submitDelete(selectedCancha.id)}>Eliminar</button>
                </div>
              </div>
            </BasicModal>
          )}
        </div>
      )}

      {isModalAddActive && (
        <BasicModal>
          <FormCancha cancha={selectedCancha} onSubmit={(data: canchaValues) => submitAdd(data)} onCancel={closeModal} />
        </BasicModal>
      )}
    </>
  )
}