import { useEffect, useState } from "react";
import { useFetchManual } from "../../hooks";
import { type Page, type Turno, type turnoValues } from "../../models";
import "./turnos.page.css";
import { BasicModal, FormTurno, Loading, PageableFooter, TurnoDisplay } from "../../components";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { hasSameValues, mapperTurnoValuesToTurno } from "../../utils";

export const TurnosPage = () => {
  const { data: pageTurnos, isLoading, error, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();

  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isModalAddActive, setIsModalAddActive] = useState<boolean>(false);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);
  const [isModalEditActive, setIsModalEditActive] = useState<boolean>(false);
  const defaultTurnosUrl = new URL(axiosInterceptor.defaults.baseURL + "/turnos?sortBy=inicioTurno,ASC&sortBy=finTurno,ASC&pageNo=0&pageSize=10");

  const [turnosUrl, setTurnosUrl] = useState<URL>(defaultTurnosUrl);

  useEffect(() => {
    loadTurnos(turnosUrl.href, "GET");
  }, [turnosUrl]);

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
        loadTurnos(turnosUrl.href, "GET");
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
        loadTurnos(turnosUrl.href, "GET");
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
        loadTurnos(turnosUrl.href, "GET");
      });
    // No es necesario el catch ya que el axiosInterceptor lo maneja
  }

  const closeModal = () => {
    setSelectedTurno(null);
    setIsModalAddActive(false);
    setIsModalDeleteActive(false);
    setIsModalEditActive(false);
  }

  const traerPaginaAnterior = () => {
    if (!pageTurnos || pageTurnos.pageNo === 0) {
      console.error("Error: Ya estamos en la primera página!");
      return;
    }

    let aux = new URL(turnosUrl);
    aux.searchParams.set("pageNo", `${pageTurnos.pageNo - 1}`);
    setTurnosUrl(aux);
  }

  const traerPaginaSiguiente = () => {
    if (!pageTurnos || pageTurnos.last) {
      console.error("Error: Ya estamos en la última página!");
      return;
    }

    let aux = new URL(turnosUrl);
    aux.searchParams.set("pageNo", `${pageTurnos.pageNo + 1}`);
    setTurnosUrl(aux);
  }

  const reverseOrder = () => {
    if (!pageTurnos) {
      console.error("Error: Los turnos aun no se han cargado!");
      return;
    }

    // Si bien nos traemos todos, solo nos importa el primero (inicioTurno)
    const params: string[] = turnosUrl.searchParams.getAll("sortBy");
    if (params.length == 0) { return; }

    const updatedParams = params.map(param => {
      if (param.includes("inicioTurno,ASC")) {
        return param.replace(",ASC", ",DESC");
      } else if (param.includes("inicioTurno,ASC")) {
        return param.replace(",DESC", ",ASC");
      }
      return param; // Si no es el que queremos, lo devolvemos tal cual
    });

    let aux = new URL(turnosUrl);

    aux.searchParams.delete("sortBy");

    updatedParams.forEach(param => {
      aux.searchParams.append("sortBy", param);
    });

    // Mandamos al usuario a la pagina 0
    if (aux.searchParams.has("pageNo")) {
      aux.searchParams.set("pageNo", "0");
    }

    setTurnosUrl(aux);
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
        {!isLoading && !error && pageTurnos && (
          <div className="turnos-container">
            {pageTurnos.totalElements == 0 && (
              <p>Parece que no hay turnos cargados en el sistema!</p>
            )}
            {pageTurnos.content && (
              <>
                <button className="btn btn-primary border-radius--500 turnos-container__reverseBtn" onClick={reverseOrder}>Ver mas {turnosUrl.searchParams.get("sortBy")?.includes("ASC") ? "antiguos" : "nuevos"}</button>
                {pageTurnos.content.map(turno => (
                  <TurnoDisplay key={turno.id} turno={turno} >
                    <div className="turnos-page__action-buttons">
                      <button className="btn btn-secondary border-radius--500" onClick={() => onClickEdit(turno)}>Editar</button>
                      <button className="btn btn-danger border-radius--500" onClick={() => onClickDelete(turno)}>Eliminar</button>
                    </div>
                  </TurnoDisplay>
                ))}
                <PageableFooter page={pageTurnos} onNext={traerPaginaSiguiente} onPrevious={traerPaginaAnterior} />
              </>
            )}

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