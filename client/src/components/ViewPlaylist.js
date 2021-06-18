import {HOST} from '../common/constants.js';
import {useEffect, useState} from 'react';
import {FaPlayCircle} from "react-icons/fa";
import {Howl} from 'howler';

const ViewPlaylist = props => {
  const {id} = props.match.params;
  const [playlistData, setPlaylistData] = useState(null);
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

  let sound = null;

  const soundPlay = (src) => {
    if (sound != null) {
      sound.stop();
      sound.unload();
      sound = null;
    } else {
      sound = new Howl ({
        src,
        html5: true
      })
      sound.play();
    }
  }

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

  if  (playlistData === null) {
    return <div className="Loader"></div>;
  }

  const trackTimeFormat = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0' ) + s;
  };

  const displayTracks = playlistData.map((track) => {
    return (
      <tbody key={track.track_id}>
        <tr className="song">
          <td className="song-album-cover">
            <div className="album-img">
              <img src={track.cover} alt="cover"/>
            </div>
          </td>
          <td className="play-preview">
            <button className="play-btn" onClick={() => soundPlay(track.preview)}>
              <FaPlayCircle/>
            </button>
          </td>
          <td className="song-title"><h5>{track.artist_name} - {track.track_title}</h5></td>
          <td className="song-length"><h5>{trackTimeFormat(track.duration)}</h5></td>
        </tr>
      </tbody>
    )
  })
  
  return(
    <div className="songs-container-main-section">
      {showError()}
      {showLoader()}
      <div className="songs-container">
        <table className="playlist-list">
          <th className="playlist-header" colspan="4">
            <h5 className="playlist-title">
              Tracklist for "{playlistData[0].title}" ({Math.round(playlistData[0].playtime/60)} min.)
            </h5>
          </th>
          {displayTracks}
        </table>
      </div>
    </div>
  )    
};
  
export default ViewPlaylist;
  