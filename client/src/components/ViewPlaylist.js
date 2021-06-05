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

  if  (playlistData === null) {
    return <div className="Loader"></div>;
  }

  const trackTimeFormat = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0' ) + s;
  };

  const ids = playlistData.map(tr => tr.deez_tracks_id);
  const filteredTracks = playlistData.filter(({deez_tracks_id}, index) => !ids.includes(deez_tracks_id, index+1));
  

  const displayTracks = filteredTracks.map((track) => {
    return (
      <tr className="song" key={track.tracks_id}>
        <td className="song-album-cover">
          <div className="album-img">
            <img src={track.albumCover} alt=""/>
          </div>
        </td>
        <td className="song-title"><h5>{track.artist_name} - {track.track_title}</h5></td>
        <td className="song-length"><h5>{trackTimeFormat(track.track_duration)}</h5></td>
      </tr>
    )
  })
  
  return(
    <div className="songs-container-main-section">
      {showError()}
      {showLoader()}
      <div className="songs-container">
        <div className="playlist-header">
          <h5 className="playlist-title">Tracks in playlist "{playlistData[0].playlist_name}" duration {Math.round(playlistData[0].duration/60)} min.</h5>
        </div>
        <table className="playlist-list">
          {displayTracks}
        </table>
      </div>
    </div>
  )    
};
  
export default ViewPlaylist;
  