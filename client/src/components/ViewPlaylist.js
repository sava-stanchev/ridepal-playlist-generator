import albumCover from '../images/cover.jpg';

const ViewPlaylist = () => {
    
  return(
    <div className="songs-container-main-section">
      <div className="songs-container">
        <div className="playlist-header">
          <h5 className="playlist-title">Songs in this playlist</h5>
        </div>
        <table className="playlist-list">
          <tr className="song">
            <td className="song-album-cover">
              <div className="album-img">
                <img src={albumCover} alt=""/>
              </div>
            </td>
            <td className="song-title"><h5>Song Title + Info</h5></td>
            <td className="song-length"><h5>3:34</h5></td>
          </tr>
          <tr className="song">
            <td className="song-album-cover">
              <div className="album-img">
                <img src={albumCover} alt=""/>
              </div>
            </td>
            <td className="song-title"><h5>Song Title + Info</h5></td>
            <td className="song-length"><h5>3:34</h5></td>
          </tr>
          <tr className="song">
            <td className="song-album-cover">
              <div className="album-img">
                <img src={albumCover} alt=""/>
              </div>
            </td>
            <td className="song-title"><h5>Song Title + Info</h5></td>
            <td className="song-length"><h5>3:34</h5></td>
          </tr>
          <tr className="song">
            <td className="song-album-cover">
              <div className="album-img">
                <img src={albumCover} alt=""/>
              </div>
            </td>
            <td className="song-title"><h5>Song Title + Info</h5></td>
            <td className="song-length"><h5>3:34</h5></td>
          </tr>
          <tr className="song">
            <td className="song-album-cover">
              <div className="album-img">
                <img src={albumCover} alt=""/>
              </div>
            </td>
            <td className="song-title"><h5>Song Title + Info</h5></td>
            <td className="song-length"><h5>3:34</h5></td>
          </tr>
          <tr className="song">
            <td className="song-album-cover">
              <div className="album-img">
                <img src={albumCover} alt=""/>
              </div>
            </td>
            <td className="song-title"><h5>Song Title + Info</h5></td>
            <td className="song-length"><h5>3:34</h5></td>
          </tr>
        </table>
      </div>
    </div>
  )    
};
  
export default ViewPlaylist;
  