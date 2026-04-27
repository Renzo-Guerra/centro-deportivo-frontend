import ReactDOM from 'react-dom';
import type { ReactNode } from "react";
import "./BasicModal.css";

interface Props {
  children: ReactNode,
}

export const BasicModal = ({ children }: Props) => {
  const mountNode = document.getElementById('root');

  if (!mountNode) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    mountNode
  );
};

