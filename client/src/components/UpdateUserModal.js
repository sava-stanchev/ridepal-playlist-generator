import ReactDom from 'react-dom'
import { useState } from 'react/cjs/react.development';
import { HOST } from '../common/constants.js';

export default function Modal({user, open, onClose}) {
  const [updatedUser, setUpdatedUser] = useState(null);

  if (!user) return null;
  if (!open) return null;
  console.log(user);

  const updateUserProp = (prop, value) => {
    console.log(value);
    setUpdatedUser({
      ...updatedUser,
      [prop]: value,
    });
    console.log();
  };

  const updateUser = () => {
    fetch(`${HOST}/users/${user.users_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedUser),
    })
    .then((res) => res.json())
    .then(data => {

    })
  };

  const closeFunction = () => {
    updateUser();
    onClose();
  }



  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <div className="input-group">
          <label>New user name:</label>
          <input type="text" name="new-user-name" value={updatedUser?updatedUser.username:user.username}
          onChange={e => updateUserProp('username', e.target.value)} />
        </div>
        <div className="input-group">
          <button type="submit" className="btn" onClick={closeFunction}>Update</button>
        </div>
        <div className="input-group">
          <button type="submit" className="btn" onClick={onClose}>Back</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
