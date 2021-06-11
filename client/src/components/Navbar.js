import {Link} from 'react-router-dom';
import AuthContext from '../providers/auth-context';
import {useContext} from 'react';
import brandLogo from '../images/logo.png';
import {CgProfile} from "react-icons/cg";
import ReactTooltip from 'react-tooltip';

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
        <a href="#home" className="brand-logo">
          <img src={brandLogo} alt="logo"/>
          <div href="#home" className="brand-logo-name">RidePal</div>
        </a>
      </Link>
      <nav className="main-nav">
        <ul>
        {
          auth.isLoggedIn
          ?
            auth.user.user_role === 1
              ?            
                <Link to="/users">
                  <li><a href="#users">Users</a></li>
                </Link>
              :  
               <></> 
          :
            null
        }
        {
          auth.isLoggedIn
          ?
          <>
            <Link to="/generate-route">
              <li><a href="#generate-route">Generate</a></li>
            </Link>
            <Link to="/home">
              <li><a href="#logout" onClick={() => logout()}>Logout</a></li>
            </Link>
            <li><button className="tooltip-icon" data-tip data-for="userTip"><CgProfile size={27}/></button></li>
            <ReactTooltip id="userTip" place="bottom" effect="solid">
              {auth.user.username}
            </ReactTooltip>
          </>
          :
          <>
            <Link to="/login">
              <li><a href="#login">Login</a></li>
            </Link>
            <Link to="/register">
              <li><a href="#register">Register</a></li>
            </Link>
          </>
        }
        </ul>
      </nav>
    </header>
  )
};

export default NavBar;
