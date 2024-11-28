import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import AlertModal from "../components/AlertModal";
import { isValidEmail, joinClasses } from "../common/utils";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: true,
    email: true,
    password: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "username" && value.length > 2) {
      setFormErrors((prevState) => ({
        ...prevState,
        username: false,
      }));
    } else if (name === "email" && isValidEmail(value)) {
      setFormErrors((prevState) => ({
        ...prevState,
        email: false,
      }));
    } else if (name === "password" && value.length > 3) {
      setFormErrors((prevState) => ({
        ...prevState,
        password: false,
      }));
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        [name]: true,
      }));
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
    body: JSON.stringify(formData),
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
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            aria-required="true"
          />
          <p
            className={joinClasses([
              "validation-msg",
              !formErrors.username && "validation-msg--valid",
            ])}
          >
            Username must be at least 3 characters long.
          </p>
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            aria-required="true"
          />
          <p
            className={joinClasses([
              "validation-msg",
              !formErrors.email && "validation-msg--valid",
            ])}
          >
            Please enter a valid email address.
          </p>
        </div>
        <div className="input-group">
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
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            aria-required="true"
          />
          <p
            className={joinClasses([
              "validation-msg",
              !formErrors.password && "validation-msg--valid",
            ])}
          >
            Password must be at least 4 characters long.
          </p>
        </div>
        <div className="input-group">
          <button
            type="button"
            className="btn"
            onClick={() => signUp(registerRequest)}
            disabled={!Object.values(formErrors).every((val) => val === false)}
          >
            Join Now
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
