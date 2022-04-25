import { HOST } from "../common/constants";
import { useEffect, useState } from "react";
import { convertHMS, trackTimeFormat } from "../common/utils";
import { useHistory } from "react-router-dom";

const ViewPlaylist = (props) => {
  const { id } = props.match.params;
  const history = useHistory();
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${HOST}/playlists/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setPlaylistData(data))
      .catch(() => history.push("/500"))
      .finally(() => setLoading(false));
  }, [id, history]);

  const Loader = () => <div className="loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />;
    }
  };

  if (playlistData === null) {
    return <div className="loader"></div>;
  }

  const displayTracks = playlistData.map((track) => {
    return (
      <tbody key={track.track_id}>
        <tr className="song">
          <td className="song__cover">
            <div className="song__cover-img">
              <img src={track.cover} alt="cover" />
            </div>
          </td>
          <td className="song__title">
            <h5>
              {track.artist_name} - {track.track_title}
            </h5>
          </td>
          <td className="song__length">
            <h5>{trackTimeFormat(track.duration)}</h5>
          </td>
          <td className="song__preview">
            <audio controls className="song__audio" controlsList="nodownload">
              <source src={track.preview} type="audio/mp3" />
            </audio>
          </td>
        </tr>
      </tbody>
    );
  });

  return (
    <div className="playlist">
      {showLoader()}
      <div className="playlist__container">
        <table className="playlist__table">
          <thead>
            <tr>
              <th className="playlist__header" colSpan="4">
                <h1 className="playlist__title">
                  Tracklist for "{playlistData[0].title}" (
                  {convertHMS(playlistData[0].playtime)})
                </h1>
              </th>
            </tr>
          </thead>
          {displayTracks}
        </table>
      </div>
    </div>
  );
};

export default ViewPlaylist;
