import { useForm } from "react-hook-form";
import "./formTurnoRange.css";
import { FormInput } from "../FormInput/FormInput";
import { turnoRangeScheema, type TurnoRangeValues } from "../../models/schemas/turnoRange.squema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, formatToDateLocal, subtractDays } from "../../utils";

interface Props {
  onSubmit: (data: TurnoRangeValues) => void,
}

export const FormTurnoRange = ({ onSubmit }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isLoading }
  } = useForm({
    resolver: zodResolver(turnoRangeScheema),
    // Por defecto filtra para traer los ultimos 7 dias
    defaultValues: {
      desde: formatToDateLocal(addDays(new Date(), 1)),
      hasta: formatToDateLocal(addDays(new Date(), 1)),
    }
  });

  const bringYesterday = () => {
    setValue("desde", formatToDateLocal(subtractDays(new Date(), 1)));
    setValue("hasta", formatToDateLocal(subtractDays(new Date(), 1)));
  }

  const bringTomorrow = () => {
    setValue("desde", formatToDateLocal(addDays(new Date(), 1)));
    setValue("hasta", formatToDateLocal(addDays(new Date(), 1)));
  }

  const bringLastWeek = () => {
    setValue("desde", formatToDateLocal(subtractDays(new Date(), 7)));
    setValue("hasta", formatToDateLocal(new Date()));
  }

  const bringNextWeek = () => {
    setValue("desde", formatToDateLocal(new Date()));
    setValue("hasta", formatToDateLocal(addDays(new Date(), 7)));
  }

  const bringLastMonth = () => {
    setValue("desde", formatToDateLocal(subtractDays(new Date(), 30)));
    setValue("hasta", formatToDateLocal(new Date()));
  }

  const bringNextMonth = () => {
    setValue("desde", formatToDateLocal(new Date()));
    setValue("hasta", formatToDateLocal(addDays(new Date(), 30)));
  }

  return (
    <>
      <form className="form form-turno-range" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-turno-range__filterContainer">
          <button type="button" className="btn btn-accent border-radius--500" onClick={bringYesterday}>Ayer</button>
          <button type="button" className="btn btn-accent border-radius--500" onClick={bringTomorrow}>Mañana</button>
          <button type="button" className="btn btn-accent border-radius--500" onClick={bringLastWeek}>Ultima semana</button>
          <button type="button" className="btn btn-accent border-radius--500" onClick={bringNextWeek}>Proxima semana</button>
          <button type="button" className="btn btn-accent border-radius--500" onClick={bringLastMonth}>Ultimo mes</button>
          <button type="button" className="btn btn-accent border-radius--500" onClick={bringNextMonth}>Proximo mes</button>
        </div>
        <FormInput name={"desde"} label={"Desde"} type={"date"} control={control} error={errors.desde} />
        <FormInput name={"hasta"} label={"Hasta"} type={"date"} control={control} error={errors.hasta} />

        <button type="submit" className="btn btn-accent border-radius--500 form-turno-range__submitBtn" disabled={isLoading}>Filtrar</button>
      </form>
    </>
  )
}