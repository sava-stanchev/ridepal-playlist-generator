import ReactDom from "react-dom";

export default function Modal({ alertMsg, open, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="overlay" />
      <div className="modal">
        <p className="modal__alert">{alertMsg}</p>
        <button className="btn" onClick={onClose}>
          OK
        </button>
      </div>
    </>,
    document.getElementById("portal")
  );
}
