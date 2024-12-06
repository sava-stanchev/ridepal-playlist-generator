import { useState } from "react";
import { Link } from "react-router-dom";
import { isValidEmail, joinClasses } from "../common/utils";

const ForgottenPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "email" && isValidEmail(value)) {
      setFormErrors((prevState) => ({
        ...prevState,
        email: false,
      }));
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        [name]: true,
      }));
    }
  };

  return (
    <section className="input-page">
      <h1 className="input-page__text">
        Welcome
        <span className="input-page__text--accent">!</span>
      </h1>
      <form className="input-page__form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
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
          <button type="button" className="btn">
            Send password reset email
          </button>
        </div>
        <Link className="input-page__link" to="/login">
          I remember my password
        </Link>
      </form>
    </section>
  );
};

export default ForgottenPassword;
