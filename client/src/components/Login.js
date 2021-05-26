import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HOST } from '../common/constants.js';
import decode from 'jwt-decode';
import AuthContext from '../providers/auth-context.js';



const Login = () => {
  
  const history = useHistory();
  const auth = useContext(AuthContext);
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

  const routeChange = () => {
    const path = `/home`;
    history.push(path);
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
    .then(({ token }) => {
      try {
        const user = decode(token);
        localStorage.setItem('token', token);
        auth.setAuthState({user, isLoggedIn: true});
      } catch (error) {
        window.alert('Invalid username or password!');
      }
    })
    .then(() => routeChange())
    .catch(console.warn);
  };

    
  return(
  
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Welcome
        <span className="accent-text">!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group">
          <label>Name:</label>
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
