import { useEffect, useState } from "react";
import { useFetchManual } from "../../hooks";
import { type Turno, type turnoValues } from "../../models";
import "./turnos.page.css";
import { BasicModal, FormTurno, Loading, TurnoDisplay } from "../../components";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { hasSameValues, mapperTurnoValuesToTurno } from "../../utils";

export const TurnosPage = () => {
  const { data: turnos, isLoading, error, submitRequest: loadTurnos } = useFetchManual<Turno[]>();

  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);
  const [isModalEditActive, setIsModalEditActive] = useState<boolean>(false);

  const turnosUrl = "/turnos/all?sortBy=inicioTurno,ASC&sortBy=finTurno,ASC&sortBy=inicioTurno,ASC";

  useEffect(() => {
    loadTurnos(turnosUrl, "GET");
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
        loadTurnos(turnosUrl, "GET");
      });
  }

  const onClickEdit = (turno: Turno) => {
    setSelectedTurno(turno);
    setIsModalEditActive(true);
  }

  const submitEdit = (data: turnoValues) => {
    // Fast ending en caso de que no se hayan editado los valores
    if (hasSameValues(selectedTurno, data)) {
      toast.error("Primero debe editar los datos!");
      return;
    }

    const editedTurno: Turno = mapperTurnoValuesToTurno(data);

    toast.promise(async () => axiosInterceptor.put("/turnos/" + selectedTurno?.id, editedTurno),
      {
        loading: "Enviando",
        success: "Turno editado exitosamente!",
      }).then(() => {
        closeModal();
        loadTurnos(turnosUrl, "GET");
      });
  }

  const submitAdd = (data: turnoValues) => {
    const newTurno: Turno = mapperTurnoValuesToTurno(data);

    toast.promise(async () => axiosInterceptor.post("/turnos", newTurno),
      {
        loading: "Enviando",
        success: "Turno creado exitosamente!",
        // No es necesario un error porque axiosInterceptor lo maneja
      }).then(() => {
        closeModal();
        loadTurnos(turnosUrl, "GET");
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
      <div className="page-container">
        {isLoading && (
          <Loading mensaje="Cargando turnos..." />
        )}

        {!isLoading && error && (
          <p>{error.message}</p>
        )}
        <button className="btn btn-accent border-radius--500 btn-crear-turno" onClick={() => setIsModalAddActive(true)}>Agregar turno</button>
        {!isLoading && !error && turnos && (
          <div className="turnos-container">
            {turnos.length == 0 && (
              <p>Parece que no hay turnos cargados en el sistema!</p>
            )}
            {turnos.map(turno => (
              <TurnoDisplay key={turno.id} turno={turno} >
                <div className="turnos-page__action-buttons">
                  <button className="btn btn-secondary border-radius--500" onClick={() => onClickEdit(turno)}>Editar</button>
                  <button className="btn btn-danger border-radius--500" onClick={() => onClickDelete(turno)}>Eliminar</button>
                </div>
              </TurnoDisplay>
            ))}
          </div>
        )}

        {isModalDeleteActive && (
          <BasicModal titulo="Eliminar turno" closeModal={closeModal}>
            <div className="turnos__modal">
              <p>¿Estás seguro que quieres eliminar el turno de "{selectedTurno?.nombreCliente} {selectedTurno?.apellidoCliente}"?</p>
              <div className="turnos__modal__action-buttons">
                <button className="btn btn-secondary border-radius--500" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-danger border-radius--500" onClick={() => selectedTurno ? submitDelete(selectedTurno.id) : ""}>Eliminar</button>
              </div>
            </div>
          </BasicModal>
        )}

        {isModalAddActive && (
          <BasicModal titulo="Crear turno" closeModal={closeModal}>
            <FormTurno
              onSubmit={(data: turnoValues) => submitAdd(data)}
              onCancel={closeModal} />
          </BasicModal>
        )}

        {isModalEditActive && (
          <BasicModal titulo="Editar turno" closeModal={closeModal}>
            <FormTurno
              turno={selectedTurno}
              onSubmit={(data: turnoValues) => submitEdit(data)}
              onCancel={closeModal} />
          </BasicModal>
        )}
      </div>
    </>
  )
}