import { useForm, useWatch } from "react-hook-form";
import { TIPOS_CANCHA_ARRAY, turnoSchema, type Cancha, type Turno, type turnoValues } from "../../models";
import "./formTurno.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import type { OptionForSelect } from "../../models/types/optionForSelect";
import { formatDateTime } from "../../utils";
import { useFetchAutomatico } from "../../hooks";
import { useEffect, useMemo } from "react";

interface Props {
  turno?: Turno | null,
  onSubmit: (data: turnoValues) => void,
  onCancel: () => void,
}

export const FormTurno = ({ turno, onSubmit, onCancel }: Props) => {
  const { data: canchas, isLoading: isLoadingCanchas, error } = useFetchAutomatico<Cancha[]>("/canchas/all", "GET");

  const deporteOptions: OptionForSelect[] = TIPOS_CANCHA_ARRAY.map(tipo => ({
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
      deporte: turno?.deporte ?? deporteOptions[0].label,
      idCancha: turno?.idCancha.toString() ?? "",
      inicioTurno: turno
        ? formatDateTime(turno.inicioTurno)
        : formatDateTime(new Date()),
      duracionTurnoMinutos: turno?.duracionMinutos ?? 60
    }
  });

  const deporteSeleccionado = useWatch({
    control,
    name: "deporte",
  });

  const opcionesCanchasFiltradas = useMemo((): OptionForSelect[] => {
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
      setValue("idCancha", opcionesCanchasFiltradas[0].value.toString());
    }
  }, [canchas, opcionesCanchasFiltradas, setValue]);

  return (
    <>
      <form className="formTurno" onSubmit={handleSubmit((data: turnoValues) => onSubmit(data))}>
        <FormInput name={"nombreCliente"} label="Nombre" type="text" control={control} error={errors.nombreCliente} />
        <FormInput name={"apellidoCliente"} label="Apellido" type="text" control={control} error={errors.apellidoCliente} />
        <FormInput name={"celularCliente"} label="Celular" type="text" control={control} error={errors.celularCliente} />
        <FormSelect name={"deporte"} label={"Deporte"} options={deporteOptions} error={errors.deporte} isDisabled={turno != null && turno != undefined} control={control} />
        <FormSelect name={"idCancha"} label={"Cancha"} options={turno ? [{ label: turno.nombreCancha, value: turno.id }] : opcionesCanchasFiltradas} error={errors.idCancha} isDisabled={turno != null && turno != undefined} control={control} />
        <FormInput name={"inicioTurno"} label="Inicio turno" type="datetime-local" control={control} error={errors.inicioTurno} />
        <FormInput name={"duracionTurnoMinutos"} label="Duracion (minutos)" type="number" control={control} error={errors.duracionTurnoMinutos} />
        <div className="formTurno__actionButtons">
          <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={isLoading || isLoadingCanchas}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading || isLoadingCanchas}>Enviar</button>
        </div>
      </form>
    </>
  )
}