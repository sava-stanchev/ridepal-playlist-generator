import { useState } from "react";
import { Link } from "react-router-dom";

const ForgottenPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData(value);
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
