import ReactDom from 'react-dom'

export default function Modal({open, children, onClose}) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    </>,
    document.getElementById('portal')
  );
}
