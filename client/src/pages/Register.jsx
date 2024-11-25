import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import AlertModal from "../components/AlertModal";

const initialState = {
  username: "",
  password: "",
  email: "",
};

const passVerificationError = {
  properLength: false,
};

const emailVerificationError = {
  properEmail: false,
};

const usernameVerificationError = {
  properLength: false,
};

const Register = () => {
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passVerificationError);
  const [emailError, setEmailError] = useState(emailVerificationError);
  const [usernameError, setUsernameError] = useState(usernameVerificationError);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const history = useHistory();

  const createUser = (name, value) => {
    setNewUser({
      ...newUser,
      [name]: value,
    });

    if (name === "password") {
      const properLength = value.length >= 4 && value.length <= 30;
      setPasswordError({ ...passwordError, properLength });
    }

    if (name === "email") {
      const properEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        );
      setEmailError({ ...emailError, properEmail });
    }

    if (name === "username") {
      const properLength = value.length >= 3 && value.length <= 15;
      setUsernameError({ ...usernameError, properLength });
    }
  };

  async function signUp(request) {
    try {
      const response = await fetch(request);
      const result = await response.json();

      if (!response.ok) {
        setAlertMsg(result.message);
        setModal(true);
        throw new Error(`Response status: ${response.status}`);
      } else {
        history.push("/login");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const registerRequest = new Request(`${HOST}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  const showThePassword = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };

  return (
    <section className="main">
      <AlertModal
        openModal={modal}
        closeModal={() => setModal(false)}
        alertMsg={alertMsg}
      />
      <h1 className="main__text">
        Join and
        <span className="main__text--accent"> generate!</span>
      </h1>
      <form className="main__form">
        <div
          className="input-group"
          name="username"
          value={newUser.username}
          onChange={(e) => createUser("username", e.target.value)}
        >
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" aria-required="true" />
          <p
            className="validation-msg"
            style={usernameError.properLength ? { color: "white" } : {}}
          >
            * Between 3 and 15 chars
          </p>
        </div>
        <div
          className="input-group"
          name="email"
          value={newUser.email}
          onChange={(e) => createUser("email", e.target.value)}
        >
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" aria-required="true" />
          <p
            className="validation-msg"
            style={emailError.properEmail ? { color: "white" } : {}}
          >
            * Valid email address
          </p>
        </div>
        <div
          className="input-group"
          name="password"
          value={newUser.password}
          onChange={(e) => createUser("password", e.target.value)}
        >
          <div className="password-eye">
            <label htmlFor="password">Password:</label>
            <button
              type="button"
              className="show-password"
              onClick={() => showThePassword()}
              aria-label="Toggle password visibility"
            >
              {showPassword === false ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <input
            type={showPassword === false ? "password" : "text"}
            id="password"
            aria-required="true"
          />
          <p
            className="validation-msg"
            style={passwordError.properLength ? { color: "white" } : {}}
          >
            * Between 4 and 30 chars
          </p>
        </div>
        <div className="input-group">
          <button
            type="button"
            className="btn"
            disabled={
              !usernameError.properLength ||
              !emailError.properEmail ||
              !passwordError.properLength
            }
            onClick={() => signUp(registerRequest)}
          >
            Join Now
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
