import ReactDom from 'react-dom';
import {useEffect, useState} from 'react';
import {HOST} from '../common/constants.js';

export default function Modal({user, open, onClose, users, setUsers}) {
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
  };
  
  const updateUser = () => {
    fetch(`${HOST}/users/${user.users_id}`, {
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
      const newUsers = users.map(u => u.users_id === editedUser.users_id ? editedUser : u);
      setUsers(newUsers);
    })
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
          <input type="text" name="username" value={theUser ? theUser.username : users.filter(u => u.users_id === user.users_id)[0].username}
          onChange={e => updateUserProperties('username', e.target.value)} />
        </div>
        <div className="input-group">
          <label>New email:</label>
          <input type="text" name="email" value={theUser ? theUser.email : users.filter(u => u.users_id === user.users_id)[0].email}
          onChange={e => updateUserProperties('email', e.target.value)} />
        </div>
        <div className="input-group">
          <button className="btn" onClick={closeFunction}>Update</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
