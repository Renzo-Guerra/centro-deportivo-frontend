import { useEffect, useState } from "react";
import { CanchaDisplay, BasicModal } from "../../components";
import { useFetchManual } from "../../hooks";
import type { Cancha, Page } from "../../models";
import "./Canchas.page.css";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";

export const CanchasPage = () => {
  const { data: pageCancha, isLoading, error, submitRequest: loadCanchas } = useFetchManual<Page<Cancha>>();
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);

  useEffect(() => {
    loadCanchas("/canchas", "get");
  }, []);

  const handleClose = () => {
    setSelectedCancha(null);
  }

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
        handleClose();
        loadCanchas("/canchas", "get");
      }).catch(err => {
        console.error(err);
      });
  }

  return (
    <>
      {isLoading && (
        <p>Cargando canchas...</p>
      )}

      {!isLoading && error && (
        <p>{error.message}</p>
      )}

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
              <p>¿Estás seguro que quieres eliminar la cancha "{selectedCancha.nombre}"?</p>
              <div className="canchas__modal__action-buttons">
                <button onClick={handleClose}>Cancelar</button>
                <button onClick={() => submitDelete(selectedCancha.id)}>Eliminar</button>
              </div>
            </BasicModal>
          )}
        </div>
      )}
    </>
  )
}