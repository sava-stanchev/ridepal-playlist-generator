import ReactDom from 'react-dom';

export default function Modal({alertMsg, open, onClose}) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <p>{alertMsg}</p>
        <div className="input-group">
          <button className="btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
