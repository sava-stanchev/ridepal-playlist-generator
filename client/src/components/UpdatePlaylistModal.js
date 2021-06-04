import { useState } from 'react';
import ReactDom from 'react-dom';
import {HOST} from '../common/constants.js';

export default function Modal({playlist, open, onClose, playlists, setPlaylists}) {
  const [thePlaylist, setThePlaylist] = useState(null);

  if (!playlist) return null;
  if (!open) return null;

  const updatePlaylistProperties = (prop, value) => {
    setThePlaylist({
      ...thePlaylist,
      [prop]: value,
    });
  };

  const updatePlaylist = () => {
    fetch(`${HOST}/playlists/${playlist.playlists_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(thePlaylist),
    })
    .then((res) => res.json())
    .then((data) => {
      const editedPlaylist = data;
      const newPlaylists = playlists.map(p => p.playlists_id === editedPlaylist.playlists_id ? editedPlaylist : p);
      setPlaylists(newPlaylists);
    })
  };

  const closeFunction = () => {
    updatePlaylist();
    onClose();
  }

  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
      <button className="close-button" onClick={onClose}>&times;</button>
        <div className="input-group">
          <label>New playlist name:</label>
          <input type="text" name="playlist_name" value={thePlaylist ? thePlaylist.playlist_name : playlist.playlist_name}
          onChange={e => updatePlaylistProperties('playlist_name', e.target.value)} />
        </div>
        <div className="input-group">
          <button className="btn" onClick={closeFunction}>Update</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
