import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../providers/auth-context";
import { useContext } from "react";
import brandLogo from "../images/logo.png";
import { CgProfile } from "react-icons/cg";
import ReactTooltip from "react-tooltip";
import { FiLogOut } from "react-icons/fi";
import { HOST } from "../common/constants";

const NavBar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  async function signOut(request) {
    try {
      const response = await fetch(request);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        auth.setUser(null);
        localStorage.removeItem("token");
        history.push("/home");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const logoutRequest = new Request(`${HOST}/logout`, {
    method: "DELETE",
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  });

  return (
    <header className="header">
      <Link to="/home">
        <div className="header__logo">
          <img src={brandLogo} alt="logo" />
          <div href="#home" className="brand-logo-name">
            RidePal
          </div>
        </div>
      </Link>
      <nav className="header__nav">
        <ul>
          {user ? (
            <>
              {user.role === 1 && (
                <Link to="/users">
                  <li>Users</li>
                </Link>
              )}
              <Link to="/generate-route">
                <li>Generate</li>
              </Link>
              <li>
                <button
                  className="tooltip-icon-user"
                  data-tip
                  data-for="userTip"
                >
                  <CgProfile size={27} />
                </button>
              </li>
              <ReactTooltip id="userTip" place="bottom" effect="solid">
                {user.username}
              </ReactTooltip>
              <Link to="/home">
                <li onClick={() => signOut(logoutRequest)}>
                  <button
                    className="tooltip-icon-logout"
                    data-tip
                    data-for="log-out"
                  >
                    <FiLogOut size={27} />
                  </button>
                </li>
                <ReactTooltip id="log-out" place="bottom" effect="solid">
                  Log out
                </ReactTooltip>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <li>Login</li>
              </Link>
              <Link to="/register">
                <li>Register</li>
              </Link>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
