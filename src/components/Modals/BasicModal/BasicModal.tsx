import ReactDOM from 'react-dom';
import type { ReactNode } from "react";
import "./BasicModal.css";

interface Props {
  titulo: string,
  closeModal: () => void,
  children: ReactNode,
}

export const BasicModal = ({ titulo, closeModal, children }: Props) => {
  const mountNode = document.getElementById('root');

  if (!mountNode) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className='modal-content__header'>
          <h2>{titulo}</h2>
          <button className='modal-content__closeModalBtn' onClick={closeModal}>X</button>
        </div>
        <div className='modal-content__children-container'>
          {children}
        </div>
      </div>
    </div>,
    mountNode
  );
};

