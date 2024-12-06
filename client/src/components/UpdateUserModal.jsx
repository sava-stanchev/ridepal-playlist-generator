import { useState, useRef, useEffect } from "react";
import * as userActions from "../store/actions/users";
import { useDispatch } from "react-redux";

const usernameVerificationError = {
  properLength: true,
};

const emailVerificationError = {
  properEmail: true,
};

export default function Modal({ user, users, openModal, closeModal }) {
  const ref = useRef();
  const [emailError, setEmailError] = useState(emailVerificationError);
  const [usernameError, setUsernameError] = useState(usernameVerificationError);
  const [updatedUser, setUpdatedUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  if (!user) return null;

  const updateUserProperties = (prop, value) => {
    setUpdatedUser({
      ...updatedUser,
      [prop]: value,
    });

    if (prop === "email") {
      const properEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        );
      setEmailError({ ...emailError, properEmail });
    }

    if (prop === "username") {
      const properLength = value.length >= 3 && value.length <= 15;
      setUsernameError({ ...usernameError, properLength });
    }
  };

  const updateUser = () => {
    dispatch(userActions.updateUser(user.id, updatedUser));
  };

  const closeFunction = () => {
    updateUser();
    closeModal();
  };

  return (
    <dialog ref={ref} onCancel={closeModal} className="modal">
      <button className="modal__close" onClick={closeModal}>
        &times;
      </button>
      <div className="input-group">
        <label>New username:</label>
        <input
          type="text"
          name="username"
          value={
            updatedUser
              ? updatedUser.username
              : users.filter((u) => u.id === user.id)[0].username
          }
          onChange={(e) => updateUserProperties("username", e.target.value)}
        />
        <p
          className="input-group__validation-msg"
          style={{ color: usernameError.properLength ? "white" : "red" }}
        >
          * Between 3 and 15 chars
        </p>
      </div>
      <div className="input-group">
        <label>New email:</label>
        <input
          type="text"
          name="email"
          value={
            updatedUser
              ? updatedUser.email
              : users.filter((u) => u.id === user.id)[0].email
          }
          onChange={(e) => updateUserProperties("email", e.target.value)}
        />
        <p
          className="input-group__validation-msg"
          style={{ color: emailError.properEmail ? "white" : "red" }}
        >
          * Valid email address
        </p>
      </div>
      <div className="input-group">
        <button
          className="btn"
          disabled={
            usernameError.properLength && emailError.properEmail ? false : true
          }
          onClick={closeFunction}
        >
          Update
        </button>
      </div>
    </dialog>
  );
}
