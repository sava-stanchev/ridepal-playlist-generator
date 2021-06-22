import {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {HOST} from '../common/constants';
import decode from 'jwt-decode';
import AuthContext from '../providers/auth-context';
import AlertModal from './AlertModal';

const Login = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const updateUser = (prop, value) => {
    setUser({
      ...user,
      [prop]: value,
    })
  };
  
  const login = (e) => {
    e.preventDefault();
    fetch(`${HOST}/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    .then(res => res.json())
    .then((res) => {
      if (res.message) {
        setAlertMsg(res.message);
        setIsOpen(true);
      } else {
        localStorage.clear();
        localStorage.setItem('token', res.token);
        const user = decode(res.token);
        auth.setAuthState({user, isLoggedIn: true});
        history.push('/home');
      }
    })
    .catch(() => history.push('/500'));
  };

  return(
    <section className="join-login-main-section">
      <AlertModal open={isOpen} onClose={() => setIsOpen(false)} alertMsg={alertMsg} />
      <h1 className="join-login-text">
        Welcome
        <span className="accent-text">!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group">
          <label>Username:</label>
          <input type="text" onChange={e => updateUser('username', e.target.value)}/>
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" onChange={e => updateUser('password', e.target.value)}/>
        </div>
        <div className="input-group">
          <button className="btn" onClick={(e) => login(e)}>Sign in</button>
        </div>
      </form>
    </section>
  )    
};
  
export default Login;
