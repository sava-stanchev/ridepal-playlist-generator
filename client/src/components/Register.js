import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import { HOST } from '../common/constants';

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

  const updateUser = (name, value) => {
    setNewUser({
      ...newUser,
      [name]: value,
    });

    if (name === "password") {
      const properLength = value.length >= 4 && value.length <= 30;
      setPasswordError({...passwordError, properLength});
    }

    if (name === "email") {
      const properEmail = value.includes('@') && value.length > 7;
      setEmailError({...emailError, properEmail});
    }

    if (name === "username") {
      const properLength = value.length >= 3 && value.length <= 20;
      setUsernameError({...usernameError, properLength});
    }
  };
  console.log(newUser);

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
          <div className="input-group" name="username" value={newUser.username} onChange={e => updateUser('username', e.target.value)}>
            <label>Name:</label>
            <input type="text"/>
          </div>
          <div className="input-group" name="email" value={newUser.email} onChange={e => updateUser('email', e.target.value)}>
            <label>Email:</label>
            <input type="email"/>
          </div>
          <div className="input-group" name="password" value={newUser.password} onChange={e => updateUser('password', e.target.value)}>
            <label>Password:</label>
            <input type="password"/>
          </div>
          <div className="input-group">
            <button type="submit" className="btn" onClick={(e) => register(e)}>Join Now</button>
          </div>
        </form>
      </section>
    )    
  };
    
  export default Register;
