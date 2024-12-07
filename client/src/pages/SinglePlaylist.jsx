import { HOST } from "../common/constants";
import { useCallback, useEffect, useState } from "react";
import { convertHMS } from "../common/utils";
import Loader from "../components/Loader";
import Track from "../components/Track";

const SinglePlaylist = ({
  match: {
    params: { id },
  },
}) => {
  const [playlistData, setPlaylistData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaylist = useCallback(async () => {
    try {
      const response = await fetch(`${HOST}/playlists/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist. Status: ${response.status}`);
      }

      const result = await response.json();
      setPlaylistData(result);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getPlaylist();
  }, [getPlaylist]);

  const playlistTitle = playlistData?.[0]?.title ?? "Unknown Playlist";
  const playlistPlaytime = playlistData?.[0]?.playtime
    ? convertHMS(playlistData[0].playtime)
    : "N/A";

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
                    Tracklist for "{playlistTitle}" ({playlistPlaytime})
                  </h1>
                </th>
              </tr>
            </thead>
            <tbody>
              {playlistData.map((track) => (
                <Track key={track.track_id} {...track} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SinglePlaylist;
