import albumCover from '../images/cover.jpg';

const ViewPlaylist = () => {
    
  return(
    <div className="songs-container-main-section">
    <div className="songs-container">
      <div className="playlist-header">
        <h5 className="playlist-title">Songs in this playlist fssfoisajfioashfioashg</h5>
      </div>
      <div className="playlist-songs">
      <div classname="songs-box">
        <div className="songs-info">
          <div className="album-img">
            <img src={albumCover} alt=""/>
          </div>
        </div>
        <div className="songs-name">
          <h6>Single Song Title sgagjaoghsao3522 gagasgasgs asgsagasgasgas 35235uasagasg</h6>
          <p>Some info stuff</p>
          <hr/>
        </div>
      </div>
      </div>
    </div>
    </div>
  )    
};
  
export default ViewPlaylist;
  