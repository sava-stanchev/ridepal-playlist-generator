import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import AlertModal from "../components/AlertModal";
import { isValidEmail, isValidPassword, joinClasses } from "../common/utils";

const Register = () => {
  const history = useHistory();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        setFormErrors((prevState) => ({
          ...prevState,
          username: value.length < 3,
        }));
        break;
      case "email":
        setFormErrors((prevState) => ({
          ...prevState,
          email: !isValidEmail(value),
        }));
        break;
      case "password":
        setFormErrors((prevState) => ({
          ...prevState,
          password: !isValidPassword(value),
        }));
        break;
      default:
        break;
    }
  };

  const signUp = async () => {
    try {
      const response = await fetch(`${HOST}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = !Object.values(formErrors).some((val) => val);

  return (
    <section className="input-page">
      <AlertModal
        openModal={modal}
        closeModal={() => setModal(false)}
        alertMsg={alertMsg}
      />
      <h1 className="input-page__text">
        Join and
        <span className="input-page__text--accent"> generate!</span>
      </h1>
      <form className="input-page__form">
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
              "input-group__validation-msg",
              !formErrors.username && "input-group__validation-msg--valid",
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
              "input-group__validation-msg",
              !formErrors.email && "input-group__validation-msg--valid",
            ])}
          >
            Please enter a valid email address.
          </p>
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            maxLength="64"
            aria-required="true"
          />
          <button
            type="button"
            className="password-visibility-toggle"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
          <p
            className={joinClasses([
              "input-group__validation-msg",
              !formErrors.password && "input-group__validation-msg--valid",
            ])}
          >
            Password must be at least 8 characters long and include a digit, a
            lowercase letter, an uppercase letter, and a special character.
          </p>
        </div>
        <div className="input-group">
          <button
            type="button"
            className="btn"
            onClick={signUp}
            disabled={!isFormValid}
          >
            Join Now
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
