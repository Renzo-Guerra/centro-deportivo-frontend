import "./MetricCard.css";

interface Props {
  label: string,
  cantidad: string | number,
}

export const MetricCard = ({ label, cantidad }: Props) => {
  return (
    <>
      <div className="panel-info">
        <span className="panel-info__cantidad">{cantidad}</span>
        <p className="panel-info__texto">{label}</p>
      </div>
    </>
  )
}