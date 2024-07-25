import { HOST } from "../common/constants";
import { useEffect, useState } from "react";
import { convertHMS, trackTimeFormat } from "../common/utils";
import Loader from "./Loader";

const SinglePlaylist = (props) => {
  const { id } = props.match.params;
  const [playlistData, setPlaylistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaylistRequest();
  });

  async function getPlaylistRequest() {
    try {
      const response = await fetch(`${HOST}/playlists/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        setPlaylistData(result);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderTracks = playlistData.map((track) => {
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
      {loading && <Loader />}
      {!loading && (
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
            {renderTracks}
          </table>
        </div>
      )}
    </div>
  );
};

export default SinglePlaylist;
