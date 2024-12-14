import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import decode from "jwt-decode";
import { AuthContext } from "../providers/AuthContext";
import AlertModal from "../components/AlertModal";

const Login = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function signIn(request) {
    try {
      const response = await fetch(request);
      const result = await response.json();

      if (!response.ok) {
        setAlertMsg(result.message);
        setModal(true);
        throw new Error(`Response status: ${response.status}`);
      } else {
        localStorage.clear();
        localStorage.setItem("token", result.token);
        const user = decode(result.token);
        auth.setUser(user);
        history.push("/home");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const loginRequest = new Request(`${HOST}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="input-page">
      <AlertModal
        openModal={modal}
        closeModal={() => setModal(false)}
        alertMsg={alertMsg}
      />
      <h1 className="input-page__text">
        Welcome
        <span className="input-page__text--accent">!</span>
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
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            aria-required="true"
          />
          <button
            type="button"
            className="password-visibility-toggle"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {showPassword === false ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="input-group">
          <button
            type="button"
            className="btn"
            onClick={() => signIn(loginRequest)}
          >
            Sign in
          </button>
        </div>
        <Link className="input-page__link" to="/forgotten-password">
          Forgot your password?
        </Link>
      </form>
    </section>
  );
};

export default Login;
