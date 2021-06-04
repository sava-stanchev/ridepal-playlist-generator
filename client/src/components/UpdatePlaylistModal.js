import { useState } from 'react';
import ReactDom from 'react-dom';
import {HOST} from '../common/constants.js';

export default function Modal({playlist, open, onClose}) {
  const [thePlaylist, setThePlaylist] = useState(null);
  console.log(playlist);
  if (!playlist) return null;
  if (!open) return null;

  console.log('first playlist');
  console.log(thePlaylist);

  const updatePlaylistProps = (prop, value) => {
    console.log(value);
    setThePlaylist({
      ...thePlaylist,
      [prop]: value,
    });
    console.log(thePlaylist);
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
  };

  const closeFunction = () => {
    updatePlaylist();
    onClose();
  }

  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <div className="input-group">
          <label>New playlist name:</label>
          <input type="text" name="playlist_name" value={thePlaylist ? thePlaylist.playlist_name : playlist.playlist_name}
          onChange={e => updatePlaylistProps('playlist_name', e.target.value)} />
        </div>
        <div className="input-group">
          <button type="submit" className="btn" onClick={closeFunction}>Update</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
