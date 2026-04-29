import { useForm } from "react-hook-form";
import "./FormCancha.css";
import { canchaSchema, TIPOS_CANCHA_ARRAY, type Cancha, type canchaValues } from "../../models";
import { FormInput } from "../FormInput/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../FormSelect/FormSelect";

interface Props {
  cancha: Cancha | null,
  onSubmit: (data: canchaValues) => void,
  onCancel: () => void,
}

export const FormCancha = ({ cancha, onSubmit, onCancel }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading }
  } = useForm<canchaValues>({
    resolver: zodResolver(canchaSchema),
    defaultValues: {
      nombre: cancha ? cancha.nombre : "",
      tipo: cancha ? cancha.tipo : TIPOS_CANCHA_ARRAY[0],
    },
  });

  return (
    <>
      <form className="formCancha" onSubmit={handleSubmit((data: canchaValues) => onSubmit(data))}>
        <FormInput name={"nombre"} type="text" control={control} error={errors.nombre} />
        <FormSelect name={"tipo"} values={TIPOS_CANCHA_ARRAY} control={control} error={errors.tipo} />
        <div className="formCancha__actionButtons">
          <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={isLoading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>Enviar</button>
        </div>
      </form>
    </>
  )
}