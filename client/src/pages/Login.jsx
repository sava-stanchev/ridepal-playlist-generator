import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import decode from "jwt-decode";
import { AuthContext } from "../providers/auth-context";
import AlertModal from "../components/AlertModal";

const Login = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });

  const updateUserInput = (prop, value) => {
    setUserInput({
      ...userInput,
      [prop]: value,
    });
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
    body: JSON.stringify(userInput),
  });

  return (
    <section className="main">
      <AlertModal
        openModal={modal}
        closeModal={() => setModal(false)}
        alertMsg={alertMsg}
      />
      <h1 className="main__text">
        Welcome
        <span className="main__text--accent">!</span>
      </h1>
      <form className="main__form">
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            aria-required="true"
            onChange={(e) => updateUserInput("username", e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            aria-required="true"
            onChange={(e) => updateUserInput("password", e.target.value)}
          />
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
      </form>
    </section>
  );
};

export default Login;
