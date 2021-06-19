import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {HOST} from '../common/constants';
import {FaEyeSlash} from "react-icons/fa";

const initialState = {
  username: '',
  password: '',
  email: '',
}

const passVerificationError = {
  properLength: false,
};

const emailVerificationError = {
  properEmail: false,
}

const usernameVerificationError = {
  properLength: false,
}

const Register = () => {
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passVerificationError);
  const [emailError, setEmailError] = useState(emailVerificationError);
  const [usernameError, setUsernameError] = useState(usernameVerificationError);

  const history = useHistory();
  const routeChange = () =>{ 
    const path = `/login`; 
    history.push(path);
  };

  useEffect(() => {}, [newUser]);

  const createUser = (name, value) => {
    setNewUser({
      ...newUser,
      [name]: value,
    });

    if (name === "password") {
      const properLength = value.length >= 4 && value.length <= 30;
      setPasswordError({...passwordError, properLength});
    }

    if (name === "email") {
      const properEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
      setEmailError({...emailError, properEmail});
    }

    if (name === "username") {
      const properLength = value.length >= 3 && value.length <= 15;
      setUsernameError({...usernameError, properLength});
    }
  };

  const register = (e) => {
    e.preventDefault();
    fetch(`${HOST}/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
    .then((res) => res.json())
    .then((res) => {
      try {
        console.log({res});
      } catch (error) {
        console.warn(error);
      }
    })
    .then(() => routeChange());
  };
    
  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Join and
        <span className="accent-text"> generate!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group" name="username" value={newUser.username} onChange={e => createUser('username', e.target.value)}>
          <label>Username:</label>
          <input type="text"/>
          <p className ="registerMsg" style={usernameError.properLength ? {color: 'white'} : {color: 'red'}}>
           * Between 3 and 15 chars
          </p>
        </div>
        <div className="input-group" name="email" value={newUser.email} onChange={e => createUser('email', e.target.value)}>
          <label>Email:</label>
          <input type="email"/>
          <p className ="registerMsg" style={emailError.properEmail ? {color: 'white'} : {color: 'red'}}>
            * Valid email address
          </p>
        </div>
        <div className="input-group" name="password" value={newUser.password} onChange={e => createUser('password', e.target.value)}>
          <div className="password-eye">
            <label>Password:</label>
            <button className="show-password"><FaEyeSlash/></button>
          </div>
          <input type="password"/>
          <p className ="registerMsg" style={passwordError.properLength ? {color: 'white'} : {color: 'red'}}>
            * Between 4 and 30 chars
          </p>
        </div>
        <div className="input-group">
          {
            usernameError.properLength && emailError.properEmail && passwordError.properLength ?
            <button type="submit" className="btn" onClick={(e) => register(e)}>Join Now</button>
            :
            <button type="submit" className="btn" disabled={true} onClick={(e) => register(e)}>Join Now</button>
          }
        </div>
      </form>
    </section>
  )    
};
    
export default Register;
