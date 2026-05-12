import { useEffect, useState } from "react";
import { useFetchManual } from "../../hooks";
import { type Page, type Turno, type turnoValues } from "../../models";
import "./turnos.page.css";
import { BasicModal, FormTurno, FormTurnoRange, Loading, PageableFooter, TurnoDisplay } from "../../components";
import toast from "react-hot-toast";
import { axiosInterceptor } from "../../interceptors";
import { ARG_TZ, formatArg, hasSameValues, mapperTurnoValuesToTurno } from "../../utils";
import type { TurnoRangeValues } from "../../models/schemas/turnoRange.squema";
import { format, toZonedTime } from "date-fns-tz";

export const TurnosPage = () => {
  const { data: pageTurnos, isLoading, error, submitRequest: loadTurnos } = useFetchManual<Page<Turno>>();

  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isModalDeleteActive, setIsModalDeleteActive] = useState<boolean>(false);
  const [isModalEditActive, setIsModalEditActive] = useState<boolean>(false);
  const [isModalDateRangeActive, setIsModalDateRangeActive] = useState<boolean>(false);

  const urlParams = new URLSearchParams({
    pageNo: "0",
    pageSize: "10"
  });

  urlParams.append("sortBy", "inicioTurno,DESC");
  urlParams.append("sortBy", "finTurno,ASC");

  const baseUrl = axiosInterceptor.defaults.baseURL + "/turnos";
  const defaultTurnosUrl = new URL(baseUrl);
  defaultTurnosUrl.search = urlParams.toString();

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

  const closeModal = () => {
    setSelectedTurno(null);
    setIsModalDeleteActive(false);
    setIsModalEditActive(false);
    setIsModalDateRangeActive(false);
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
      } else if (param.includes("inicioTurno,DESC")) {
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

  const filterFecha = (data: TurnoRangeValues) => {
    urlParams.set("desde", formatArg(data.desde, "yyyy-MM-dd"));
    urlParams.set("hasta", formatArg(data.hasta, "yyyy-MM-dd"));

    const newUrl = new URL(`${baseUrl}/rango`);
    newUrl.search = urlParams.toString();

    setTurnosUrl(newUrl);
    closeModal();
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

        {!isLoading && !error && pageTurnos && (
          <div className="turnos-container">
            {pageTurnos.totalElements == 0 && (
              <p>
                {
                  defaultTurnosUrl === turnosUrl
                    ? "Parece que no hay turnos cargados en el sistema!"
                    : `No se encontraron turnos entre el ${turnosUrl.searchParams.get("desde")} y el ${turnosUrl.searchParams.get("hasta")}`
                }</p>
            )}
            {pageTurnos.content && (
              <>
                <div className="turnos-container__filter-btns">
                  <button className="btn btn-accent border-radius--500" onClick={() => setIsModalDateRangeActive(true)}>Buscar por fecha</button>
                  <button className="btn btn-primary border-radius--500" onClick={reverseOrder}>Ver mas {turnosUrl.searchParams.get("sortBy")?.includes("ASC") ? "nuevos" : "antiguos"}</button>
                </div>
                <p>Resultados encontrados: {pageTurnos.totalElements}</p>
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

        {isModalEditActive && (
          <BasicModal titulo="Editar turno" closeModal={closeModal}>
            <FormTurno
              turno={selectedTurno}
              onSubmit={(data: turnoValues) => submitEdit(data)}
              onCancel={closeModal} />
          </BasicModal>
        )}

        {isModalDateRangeActive && (
          <BasicModal titulo="Filtrar turnos por fecha" closeModal={closeModal}>
            <FormTurnoRange onSubmit={(data: TurnoRangeValues) => filterFecha(data)} />
          </BasicModal>
        )}
      </div>
    </>
  )
}