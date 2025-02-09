import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../providers/AuthContext";
import { useContext } from "react";
import brandLogo from "../images/logo.png";
import { CgProfile } from "react-icons/cg";
import ReactTooltip from "react-tooltip";
import { FiLogOut } from "react-icons/fi";
import { HOST } from "../common/constants";

const NavBar = () => {
  const history = useHistory();
  const { user, setUser } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${HOST}/logout`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      setUser(null);
      localStorage.removeItem("token");
      history.push("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <header className="header">
      <Link to="/home">
        <div className="header__logo">
          <img src={brandLogo} alt="logo" />
          <div className="brand-logo-name">RidePal</div>
        </div>
      </Link>
      <nav className="header__nav">
        <ul>
          {user ? (
            <>
              {user.role === 1 && (
                <li>
                  <Link to="/users">Users</Link>
                </li>
              )}
              <li>
                <Link to="/generate-route">Generate</Link>
              </li>
              <li>
                <button
                  className="tooltip-icon-user"
                  data-tip
                  data-for="userTip"
                  aria-label="User"
                >
                  <CgProfile size={27} />
                </button>
              </li>
              <ReactTooltip
                id="userTip"
                place="bottom"
                effect="solid"
                className="react-tooltip-padding"
              >
                {user.username}
              </ReactTooltip>
              <li onClick={handleSignOut}>
                <button
                  className="tooltip-icon-logout"
                  data-tip
                  data-for="log-out"
                  aria-label="Log out"
                >
                  <FiLogOut size={27} />
                </button>
                <ReactTooltip
                  id="log-out"
                  place="bottom"
                  effect="solid"
                  className="react-tooltip-padding"
                >
                  Log out
                </ReactTooltip>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
