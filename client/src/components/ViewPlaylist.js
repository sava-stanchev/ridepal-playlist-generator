import {HOST} from '../common/constants';
import {useEffect, useState} from 'react';
import {FaPlayCircle} from "react-icons/fa";
import {Howl} from 'howler';
import {convertHMS, trackTimeFormat} from '../common/utils';
import {useHistory} from 'react-router-dom';

const ViewPlaylist = props => {
  const {id} = props.match.params;
  const history = useHistory();
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${HOST}/playlists/${id}`, { 
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => setPlaylistData(data))
    .catch(() => history.push('/500'))
    .finally(() => setLoading(false));
  }, [id, history]);

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

  const Loader = () => <div className="Loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />
    }
  }

  if  (playlistData === null) {
    return <div className="Loader"></div>;
  }

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
      {showLoader()}
      <div className="songs-container">
        <table className="playlist-list">
          <th className="playlist-header" colspan="4">
            <h5 className="playlist-title">
              Tracklist for "{playlistData[0].title}" ({convertHMS(playlistData[0].playtime)})
            </h5>
          </th>
          {displayTracks}
        </table>
      </div>
    </div>
  )    
};
  
export default ViewPlaylist;
  