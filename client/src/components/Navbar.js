import {Link} from 'react-router-dom';
import AuthContext from '../providers/auth-context';
import {useContext} from 'react';
import brandLogo from '../images/logo.png';

const NavBar = () => {
  const auth = useContext(AuthContext);
  const logout = () => {
    localStorage.removeItem('token');
    auth.setAuthState({
      user: null,
      isLoggedIn: false,
    });
  };

  return(
    <header className="main-header">
      <Link to="/home">
        <a href="#home" class="brand-logo">
          <img src={brandLogo} alt="logo"/>
          <div href="#home" className="brand-logo-name">RidePal</div>
        </a>
      </Link>  
      <nav className="main-nav">
        <ul>
          <Link to="/generate-route">
            <li><a href="#generate-route">Generate</a></li>
          </Link>
          <Link to="/home">
            <li><a href="#logout">Logout</a></li>
          </Link>
          <Link to="/login">
            <li><a href="#login">Login</a></li>
          </Link>
          <Link to="/register">
            <li><a href="#register">Register</a></li>
          </Link>
        </ul>
      </nav>
    </header>
  )
};

export default NavBar;
