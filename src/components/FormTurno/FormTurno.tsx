import { useForm, useWatch } from "react-hook-form";
import { DURACION_TURNOS_MINUTOS_OBJETO, TIPOS_CANCHA_ARRAY, turnoSchema, type Cancha, type TiposCancha, type Turno, type turnoValues } from "../../models";
import "./formTurno.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import type { OptionForSelect } from "../../models/types/optionForSelect";
import { formatArg, formatToDateLocal } from "../../utils";
import { useFetchAutomatico, useFetchManual } from "../../hooks";
import { useEffect, useMemo, useState } from "react";
import { Loading } from "../Loading/Loading";
import { DisplayTurnosDisponibles } from "../DisplayTurnosDisponibles/DisplayTurnosDisponibles";
import toast from "react-hot-toast";

interface Props {
  turno?: Turno | null,
  onSubmit: (data: turnoValues) => void,
  onCancel: () => void,
}

export const FormTurno = ({ turno, onSubmit, onCancel }: Props) => {
  const [selectedHorario, setSelectedHorario] = useState<string>("");
  const [selectedCancha, setSelectedCancha] = useState<string>("");

  const {
    data: turnosAgendados,
    isLoading: isLoadingTurnos,
    error: errorTurnosAgendados,
    submitRequest: findTurnosAgendados
  } = useFetchManual<Turno[]>();

  const {
    data: canchas,
    isLoading: isLoadingCanchas
  } = useFetchAutomatico<Cancha[]>("/canchas/all?sortBy=tipo,asc&sortBy=nombre,asc", "GET");

  // Declaramos los valores que puede tener el select de "deporte"
  const deporteOptions: OptionForSelect<TiposCancha>[] = TIPOS_CANCHA_ARRAY.map(tipo => ({
    label: tipo,
    value: tipo
  }));

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isLoading }
  } = useForm({
    resolver: zodResolver(turnoSchema),
    defaultValues: {
      nombreCliente: turno?.nombreCliente,
      apellidoCliente: turno?.apellidoCliente,
      celularCliente: turno?.celularCliente,
      deporte: turno?.deporte ?? deporteOptions[0].value,
      duracionTurnoMinutos: turno?.duracionTurnoMinutos ?? DURACION_TURNOS_MINUTOS_OBJETO[TIPOS_CANCHA_ARRAY[0]],
      diaTurno: turno?.inicioTurno
        ? formatToDateLocal(turno.inicioTurno)
        : formatToDateLocal(Date()),
      horarioTurno: turno?.inicioTurno
        ? formatArg(turno.inicioTurno, "HH:mm")
        : undefined,
      idCancha: turno?.idCancha.toString() ?? "",
    }
  });

  const selectCanchaYHorario = (idCancha: string | number, horarioSeleccionado: string) => {
    setValue("idCancha", String(idCancha));
    setValue("horarioTurno", horarioSeleccionado);
    setSelectedHorario(horarioSeleccionado);
    setSelectedCancha(String(idCancha));
  }

  // Declaramos un observer para actualizar 
  // otros datos del form cuando "deporte" cambie de valor
  const deporteSeleccionado = useWatch({
    control,
    name: "deporte",
  });

  // Declaramos un observer para actualizar 
  // otros datos del form cuando "deporte" cambie de valor
  const diaSeleccionado = useWatch({
    control,
    name: "diaTurno",
  });

  // Filtra las canchas disponibles a elegir en base al "deporte" seleccionado
  const canchasFiltradas = useMemo((): Cancha[] => {
    if (!canchas || !deporteSeleccionado) return [];

    return canchas.filter(cancha => cancha.tipo == deporteSeleccionado);
  }, [canchas, deporteSeleccionado, selectedHorario]);

  useEffect(() => {
    if (errors.horarioTurno) {
      toast.error("Elija un horario para el turno!");
    }
  }, [errors.horarioTurno]);

  useEffect(() => {
    if (!turno && canchas && canchasFiltradas.length > 0) {
      // Actualiza la duracion del turno en base al deporte
      setValue("duracionTurnoMinutos", DURACION_TURNOS_MINUTOS_OBJETO[deporteSeleccionado]);
    }
  }, [canchas, canchasFiltradas, setValue]);

  useEffect(() => {
    // Fail first
    if (!diaSeleccionado || !deporteSeleccionado) return;
    // Se cargan los turnos ordenados por idCancha
    findTurnosAgendados(`/turnos/fecha?fecha=${diaSeleccionado}&sortBy=inicioTurno`);

    // Si se está intentando CREAR un nuevo turno, 
    // reseteame los valores de cancha y horario
    if (!turno) {
      selectCanchaYHorario("", "");
    }

    // Ni bien carga el form le muestra al usuario el horario de la cancha 
    // elegida del turno a editar (siempre y cuando estemos en la fecha "inicial" del turno)
    // Inicial: Que sea la que misma que la del turno a editar  
    if (turno && formatToDateLocal(turno.inicioTurno) !== diaSeleccionado) {
      selectCanchaYHorario("", "");
    }

    // Ni bien carga el form le muestra al usuario el horario de la cancha 
    // elegida del turno a editar (siempre y cuando estemos en la fecha "inicial" del turno)
    // Inicial: Que sea la que misma que la del turno a editar
    if (turno && formatToDateLocal(turno.inicioTurno) === diaSeleccionado) {
      selectCanchaYHorario(turno.idCancha.toString(), formatArg(turno.inicioTurno, "HH:mm"));
    }

    // No se incluye "deporteSeleccionado" porque el fetch 
    // busca directamente TODOS los turnos del dia seleccionado.
    // Se filtran/ordenan del lado del cliente
  }, [diaSeleccionado]);

  return (
    <>
      <form className="form formTurno" onSubmit={handleSubmit((data: turnoValues) => onSubmit(data))}>
        <FormInput name={"nombreCliente"} label="Nombre" type="text" control={control} error={errors.nombreCliente} />
        <FormInput name={"apellidoCliente"} label="Apellido" type="text" control={control} error={errors.apellidoCliente} />
        <FormInput name={"celularCliente"} label="Celular" type="text" control={control} error={errors.celularCliente} />
        <FormSelect name={"deporte"} label={"Deporte"} options={deporteOptions} error={errors.deporte} isDisabled={turno != null && turno != undefined} control={control} />
        <FormInput name={"duracionTurnoMinutos"} label="Duracion (minutos)" type="number" control={control} error={errors.duracionTurnoMinutos} isDisabled={true} />
        <FormInput name={"diaTurno"} label="Día" type="date" control={control} error={errors.diaTurno} />

        {isLoadingTurnos && (
          <Loading mensaje="Cargando turnos..." />
        )}

        {errorTurnosAgendados && (
          <p>Error al cargar los turnos...</p>
        )}

        {!isLoadingTurnos && turnosAgendados && (
          // Por cada cancha mostrar el nombre de cancha, y los turnos
          <div className="formTurno__turnosDisponibles_container">
            {canchasFiltradas.map(cancha => (
              <DisplayTurnosDisponibles
                key={cancha.id}
                cancha={cancha}
                idSelectedCancha={selectedCancha}
                selectedHorario={selectedHorario}
                idSelectedTurno={turno ? String(turno.id) : ""}
                turnos={turnosAgendados}
                onClick={selectCanchaYHorario} />
            ))}
          </div>
        )}
        <div className="hidden">
          <FormInput name={"horarioTurno"} label="Horario" type="time" control={control} error={errors.horarioTurno} />
        </div>
        <div className="formTurno__actionButtons">
          <button type="button" className="btn btn-secondary border-radius--500" onClick={onCancel} disabled={isLoading || isLoadingCanchas}>Cancelar</button>
          <button type="submit" className="btn btn-accent border-radius--500" disabled={isLoading || isLoadingCanchas}>Enviar</button>
        </div>
      </form>
    </>
  )
}