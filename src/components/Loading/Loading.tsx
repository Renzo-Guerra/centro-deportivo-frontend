import "./loading.css";

interface Props {
  mensaje?: string,
}

export const Loading = ({ mensaje = "Cargando..." }: Props) => {
  return (
    <div className={"loading__container"}>
      <div className={"loading__spinner"}></div>
      <p className={"loading__text"}>{mensaje}</p>
    </div>
  );
}