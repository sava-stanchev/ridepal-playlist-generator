import { useState, useRef, useEffect } from "react";
import * as playlistActions from "../store/actions/playlists";
import { useDispatch } from "react-redux";
import { joinClasses } from "../common/utils";

export default function UpdatePlaylistModal({
  playlist,
  openModal,
  closeModal,
}) {
  if (!playlist) return null;

  return (
    <Modal openModal={openModal} closeModal={closeModal} playlist={playlist} />
  );
}

const Modal = ({ playlist, openModal, closeModal }) => {
  const ref = useRef();
  const [playlistName, setPlaylistName] = useState(playlist.title);
  const [playlistNameError, setPlaylistNameError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setPlaylistName(value);

    if (value.length >= 3 && value.length <= 20) {
      setPlaylistNameError(false);
    } else {
      setPlaylistNameError(true);
    }
  };

  const updatePlaylist = () => {
    dispatch(playlistActions.updatePlaylist(playlist.id, playlistName));
  };

  const closeFunction = () => {
    updatePlaylist();
    setPlaylistName("");
    closeModal();
  };

  return (
    <dialog ref={ref} onCancel={closeModal} className="modal">
      <button className="modal__close" onClick={closeModal}>
        &times;
      </button>
      <div className="input-group">
        <label htmlFor="new-playlist-name">New playlist name:</label>
        <input
          type="text"
          id="new-playlist-name"
          name="new-playlist-name"
          value={playlistName || playlist.title}
          onChange={handleInputChange}
        />
        <p
          className={joinClasses([
            "input-group__validation-msg",
            !playlistNameError && "input-group__validation-msg--valid",
          ])}
        >
          * Between 3 and 20 chars
        </p>
      </div>
      <div className="input-group">
        <button
          className="btn"
          disabled={playlistNameError}
          onClick={closeFunction}
        >
          Update
        </button>
      </div>
    </dialog>
  );
};
