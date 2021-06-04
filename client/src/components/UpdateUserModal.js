import ReactDom from 'react-dom'

export default function Modal({user, updateUserProps, open, onClose}) {
  if (!user) return null;
  if (!open) return null;
  console.log(user);
  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="input-group">
          <label>New user name:</label>
          <input type="text" name="new-user-name" value={user.username}
          onChange={e => updateUserProps('username', e.target.value)} />
        </div>
        <div className="input-group">
          <button type="submit" className="btn" onClick={onClose}>Update</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
