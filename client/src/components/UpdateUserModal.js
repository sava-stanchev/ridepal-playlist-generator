import ReactDom from 'react-dom';
import {useEffect, useState} from 'react';
import {HOST} from '../common/constants';
import {useHistory} from 'react-router-dom';

const usernameVerificationError = {
  properLength: true,
}

const emailVerificationError = {
  properEmail: true,
}

export default function Modal({user, open, onClose, users, setUsers}) {
  const history = useHistory();
  const [emailError, setEmailError] = useState(emailVerificationError);
  const [usernameError, setUsernameError] = useState(usernameVerificationError);
  const [theUser, setTheUser] = useState(null);

  useEffect(() => {
    setTheUser(user);
  }, [user])
  
  if (!user) return null;
  if (!open) return null;

  const updateUserProperties = (prop, value) => {
    setTheUser({
      ...theUser,
      [prop]: value,
    });

    if (prop === "email") {
      const properEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
      setEmailError({...emailError, properEmail});
    }

    if (prop === "username") {
      const properLength = value.length >= 3 && value.length <= 15;
      setUsernameError({...usernameError, properLength});
    }
  };
  
  const updateUser = () => {
    fetch(`${HOST}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(theUser),
    })
    .then((res) => res.json())
    .then((data) => {
      const editedUser = data;
      const newUsers = users.map(u => u.id === editedUser.id ? editedUser : u);
      setUsers(newUsers);
    })
    .catch(() => history.push('/500'));
  };
  
  const closeFunction = () => {
    updateUser();
    onClose();
  };

  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="input-group">
          <label>New username:</label>
          <input type="text" name="username" value={theUser ? theUser.username : users.filter(u => u.id === user.id)[0].username}
          onChange={e => updateUserProperties('username', e.target.value)} />
          <p className ="registerMsg" style={usernameError.properLength ? {color: 'white'} : {color: 'red'}}>
            * Between 3 and 15 chars
          </p>
        </div>
        <div className="input-group">
          <label>New email:</label>
          <input type="text" name="email" value={theUser ? theUser.email : users.filter(u => u.id === user.id)[0].email}
          onChange={e => updateUserProperties('email', e.target.value)} />
          <p className ="registerMsg" style={emailError.properEmail ? {color: 'white'} : {color: 'red'}}>
            * Valid email address
          </p>
        </div>
        <div className="input-group">
        {
          usernameError.properLength && emailError.properEmail ?
          <button className="btn" onClick={closeFunction}>Update</button>
          :
          <button className="btn" disabled={true} onClick={closeFunction}>Update</button>
        }
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
