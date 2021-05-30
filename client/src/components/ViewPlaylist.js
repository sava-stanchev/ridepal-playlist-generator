import albumCover from '../images/cover.jpg';
import {HOST} from '../common/constants.js';
import {useEffect, useState} from 'react';

const ViewPlaylist = props => {
  const [playlistData, setPlaylistData] = useState(null);
  const {id} = props.match.params;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${HOST}/playlists/${id}`, { 
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => setPlaylistData(data))
    .catch((error) => setError(error.message))
    .finally(() => setLoading(false));
  }, [id]);

  const showError = () => {
    if (error) {
      return <h4><i>An error has occured: </i>{error}</h4>
    }
  }

  const Loader = () => <div className="Loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />
    }
  }

  if  (playlistData === null || playlistData === undefined) {
    return <div className="Loader"></div>;
  }

  console.log(playlistData);

  const displayTracks = playlistData.map((track) => {
    return (
      <tr className="song">
      <td className="song-album-cover">
        <div className="album-img">
          <img src={albumCover} alt=""/>
        </div>
      </td>
      <td className="song-title"><h5>{track.track_title}, {track.artist_name}</h5></td>
      <td className="song-length"><h5>{track.track_duration/60} min.</h5></td>
      </tr>
    )
  })
  
  return(
    <div className="songs-container-main-section">
      {showError()}
      {showLoader()}
      <div className="songs-container">
        <div className="playlist-header">
          <h5 className="playlist-title">Songs in this playlist</h5>
        </div>
        <table className="playlist-list">
          {displayTracks}
        </table>
      </div>
    </div>
  )    
};
  
export default ViewPlaylist;
  