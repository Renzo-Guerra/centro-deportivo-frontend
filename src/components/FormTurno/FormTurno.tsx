import { useForm, useWatch } from "react-hook-form";
import { DURACION_TURNOS_MINUTOS_OBJETO, TIPOS_CANCHA_ARRAY, turnoSchema, type Cancha, type TiposCancha, type Turno, type turnoValues } from "../../models";
import "./formTurno.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import type { OptionForSelect } from "../../models/types/optionForSelect";
import { toDatetimeLocal } from "../../utils";
import { useFetchAutomatico } from "../../hooks";
import { useEffect, useMemo } from "react";

interface Props {
  turno?: Turno | null,
  onSubmit: (data: turnoValues) => void,
  onCancel: () => void,
}

export const FormTurno = ({ turno, onSubmit, onCancel }: Props) => {
  const {
    data: canchas,
    isLoading: isLoadingCanchas,
    error
  } = useFetchAutomatico<Cancha[]>("/canchas/all", "GET");

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
      // Al crearse un nuevo turno, necesitamos esperar los id's de la base de datos
      // Se inicializa con "" y se actualiza con un useEffect 
      // al llegar las canchas por el fetch
      idCancha: turno?.idCancha.toString() ?? "",
      inicioTurno: turno
        ? toDatetimeLocal(turno.inicioTurno)
        : toDatetimeLocal(new Date()),
      duracionTurnoMinutos: turno?.duracionMinutos ?? DURACION_TURNOS_MINUTOS_OBJETO[TIPOS_CANCHA_ARRAY[0]]
    }
  });

  // Declaramos un observer para actualizar 
  // otros datos del form cuando "deporte" cambie de valor
  const deporteSeleccionado = useWatch({
    control,
    name: "deporte",
  });

  // Filtra las canchas disponibles a elegir en base al "deporte" seleccionado
  const opcionesCanchasFiltradas = useMemo((): OptionForSelect<string | number>[] => {
    if (!canchas || !deporteSeleccionado) return [];

    return canchas
      .filter(cancha => cancha.tipo == deporteSeleccionado)
      .map(c => ({
        label: c.nombre,
        value: c.id
      }));
  }, [canchas, deporteSeleccionado]);

  useEffect(() => {
    if (!turno && canchas && opcionesCanchasFiltradas.length > 0) {
      // Selecciona el idCancha del primer elemento del select cancha
      setValue("idCancha", opcionesCanchasFiltradas[0].value.toString());
      // Actualiza la duracion del turno en base al deporte
      setValue("duracionTurnoMinutos", DURACION_TURNOS_MINUTOS_OBJETO[deporteSeleccionado]);
    }
  }, [canchas, opcionesCanchasFiltradas, setValue]);

  return (
    <>
      <form className="formTurno form" onSubmit={handleSubmit((data: turnoValues) => onSubmit(data))}>
        <FormInput name={"nombreCliente"} label="Nombre" type="text" control={control} error={errors.nombreCliente} />
        <FormInput name={"apellidoCliente"} label="Apellido" type="text" control={control} error={errors.apellidoCliente} />
        <FormInput name={"celularCliente"} label="Celular" type="text" control={control} error={errors.celularCliente} />
        <FormSelect name={"deporte"} label={"Deporte"} options={deporteOptions} error={errors.deporte} isDisabled={turno != null && turno != undefined} control={control} />
        <FormSelect name={"idCancha"} label={"Cancha"} options={turno ? [{ label: turno.nombreCancha, value: turno.id }] : opcionesCanchasFiltradas} error={errors.idCancha} isDisabled={turno != null && turno != undefined} control={control} />
        <FormInput name={"inicioTurno"} label="Inicio turno" type="datetime-local" control={control} error={errors.inicioTurno} />
        <FormInput name={"duracionTurnoMinutos"} label="Duracion (minutos)" type="number" control={control} error={errors.duracionTurnoMinutos} isDisabled={true} />
        <div className="formTurno__actionButtons">
          <button type="button" className="btn btn-secondary border-radius--500" onClick={onCancel} disabled={isLoading || isLoadingCanchas}>Cancelar</button>
          <button type="submit" className="btn btn-accent border-radius--500" disabled={isLoading || isLoadingCanchas}>Enviar</button>
        </div>
      </form>
    </>
  )
}