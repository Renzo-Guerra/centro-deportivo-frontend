import type { Page } from "../../models";
import "./pageableFooter.css";

interface Props<T> {
  page: Page<T>
  onNext: () => void,
  onPrevious: () => void,
}

export const PageableFooter = <T,>({ page, onNext, onPrevious }: Props<T>) => {
  const { pageNo, totalPages, last } = page;

  if (totalPages <= 0) return null;

  return (
    <div className="form-pageable-actionBtns-container">
      <button
        className="btn btn-primary border-radius--500"
        onClick={onPrevious}
        disabled={pageNo === 0}
      >Anterior</button>

      <p>Página {pageNo + 1} de {totalPages}</p>

      <button
        className="btn btn-primary border-radius--500"
        onClick={onNext}
        disabled={last}
      >Siguiente</button>
    </div>
  )
}