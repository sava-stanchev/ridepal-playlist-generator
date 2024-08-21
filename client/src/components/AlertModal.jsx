import { useRef, useEffect } from "react";

export default function Modal({ alertMsg, openModal, closeModal }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal} className="modal">
      <p className="modal__alert">{alertMsg}</p>
      <button className="btn" onClick={closeModal}>
        OK
      </button>
    </dialog>
  );
}
