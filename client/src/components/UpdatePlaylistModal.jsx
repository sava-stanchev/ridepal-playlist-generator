import { useState } from "react";
import ReactDom from "react-dom";
import * as playlistActions from "../store/actions/playlists";
import { useDispatch } from "react-redux";

const playlistNameVerificationError = {
  properLength: true,
};

export default function Modal({ playlist, open, onClose }) {
  const [updatedPlaylist, setUpdatedPlaylist] = useState(null);
  const [playlistNameError, setPlaylistNameError] = useState(
    playlistNameVerificationError
  );
  const dispatch = useDispatch();

  if (!playlist || !open) return null;

  const updatePlaylistProperties = (prop, value) => {
    setUpdatedPlaylist({
      ...updatedPlaylist,
      [prop]: value,
    });

    if (prop === "title") {
      const properLength = value.length >= 3 && value.length <= 20;
      setPlaylistNameError({ ...playlistNameError, properLength });
    }
  };

  const updatePlaylist = () => {
    dispatch(playlistActions.updatePlaylist(playlist.id, updatedPlaylist));
  };

  const closeFunction = () => {
    updatePlaylist();
    onClose();
  };

  return ReactDom.createPortal(
    <>
      <div className="overlay" />
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <div className="input-group">
          <label>New playlist name:</label>
          <input
            type="text"
            name="title"
            value={updatedPlaylist ? updatedPlaylist.title : playlist.title}
            onChange={(e) => updatePlaylistProperties("title", e.target.value)}
          />
          <p
            className="validation-msg"
            style={{ color: playlistNameError.properLength ? "white" : "red" }}
          >
            * Between 3 and 20 chars
          </p>
        </div>
        <div className="input-group">
          <button
            className="btn"
            disabled={playlistNameError.properLength ? false : true}
            onClick={closeFunction}
          >
            Update
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
