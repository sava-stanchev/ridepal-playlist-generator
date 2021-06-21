import {useState} from 'react';
import ReactDom from 'react-dom';
import {useHistory} from 'react-router-dom';
import {HOST} from '../common/constants';

const playlistNameVerificationError = {
  properLength: false,
}

export default function Modal({playlist, open, onClose, playlists, setPlaylists}) {
  const history = useHistory();
  const [thePlaylist, setThePlaylist] = useState(null);
  const [playlistNameError, setPlaylistNameError] = useState(playlistNameVerificationError);

  if (!playlist) return null;
  if (!open) return null;

  const updatePlaylistProperties = (prop, value) => {
    setThePlaylist({
      ...thePlaylist,
      [prop]: value,
    });

    if (prop === "title") {
      const properLength = value.length >= 3 && value.length <= 20;
      setPlaylistNameError({...playlistNameError, properLength});
    }
  };

  const updatePlaylist = () => {
    fetch(`${HOST}/playlists/${playlist.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(thePlaylist),
    })
    .then((res) => res.json())
    .then((data) => {
      const editedPlaylist = data;
      const newPlaylists = playlists.map(p => p.id === editedPlaylist.id ? editedPlaylist : p);
      setPlaylists(newPlaylists);
    })
    .catch(() => history.push('/500'));
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
          <input type="text" name="title" value={thePlaylist ? thePlaylist.title : playlist.title}
          onChange={e => updatePlaylistProperties('title', e.target.value)} />
          <p className ="registerMsg" style={playlistNameError.properLength ? {color: 'white'} : {color: 'red'}}>
            * Between 3 and 20 chars
          </p>
        </div>
        <div className="input-group">
          <button className="btn" onClick={closeFunction}>Update</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
