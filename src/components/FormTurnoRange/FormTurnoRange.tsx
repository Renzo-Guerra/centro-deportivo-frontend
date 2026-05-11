import { useForm } from "react-hook-form";
import "./formTurnoRange.css";
import { FormInput } from "../FormInput/FormInput";
import { turnoRangeScheema, type TurnoRangeValues } from "../../models/schemas/turnoRange.squema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, toDateLocal } from "../../utils";

interface Props {
  onSubmit: (data: TurnoRangeValues) => void,
}

export const FormTurnoRange = ({ onSubmit }: Props) => {

  const {
    handleSubmit,
    control,
    formState: { errors, isLoading }
  } = useForm<TurnoRangeValues>({
    resolver: zodResolver(turnoRangeScheema),
    // Por defecto filtra para traer los ultimos 7 dias
    defaultValues: {
      desde: toDateLocal(new Date(addMinutes(new Date(), 60 * 24 * 7 * -1))),
      hasta: toDateLocal(new Date()),
    }
  });

  return (
    <>
      <form className="form form-turno-range" onSubmit={handleSubmit(onSubmit)}>
        <FormInput name={"desde"} label={"Desde"} type={"date"} control={control} error={errors.desde} />
        <FormInput name={"hasta"} label={"Hasta"} type={"date"} control={control} error={errors.hasta} />

        <button type="submit" className="btn btn-accent border-radius--500" disabled={isLoading}>Filtrar</button>
      </form>
    </>
  )
}