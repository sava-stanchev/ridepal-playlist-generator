import ReactDom from 'react-dom'

export default function Modal({playlist, updatePlaylistProps, open, onClose}) {
  if (!playlist) return null;
  if (!open) return null;
  console.log(playlist);
  return ReactDom.createPortal(
    <>
      <div className="overlay-styles" />
      <div className="modal-styles">
        <div className="input-group">
          <label>New playlist name:</label>
          <input type="text" name="new-playlist-name" value={playlist.playlist_name}
          onChange={e => updatePlaylistProps('playlist_name', e.target.value)} />
        </div>
        <div className="input-group">
          <button type="submit" className="btn" onClick={onClose}>Update</button>
        </div>
        <div className="input-group">
          <button type="submit" className="btn" onClick={onClose}>Back</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
