import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";

const playlistNameVerificationError = {
  properLength: false,
};

const GeneratePlaylist = ({ points }) => {
  const history = useHistory();
  const [sliderPop, setSliderPop] = useState(0);
  const [sliderRock, setSliderRock] = useState(0);
  const [sliderRap, setSliderRap] = useState(0);
  const [playlistName, setPlaylistName] = useState("");
  const [repeatArtists, setRepeatArtists] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playlistNameError, setPlaylistNameError] = useState(
    playlistNameVerificationError
  );

  const updatePlaylistName = (prop, value) => {
    setPlaylistName({
      ...playlistName,
      [prop]: value,
    });

    if (prop === "playlistName") {
      const properLength = value.length >= 3 && value.length <= 20;
      setPlaylistNameError({ ...playlistNameError, properLength });
    }
  };

  const updateGenres = (prop, value) => {
    const sumOfSliders =
      Number(sliderRock) +
      Number(sliderPop) +
      Number(sliderRap) +
      Number(value) -
      playlistData.genres.filter((g) => g.name === prop.toLowerCase())[0]
        .duration;
    if (sumOfSliders > 100) {
      return;
    }
    setTotalDuration(sumOfSliders);

    switch (prop) {
      case "Rock":
        setSliderRock(value);
        break;
      case "Pop":
        setSliderPop(value);
        break;
      case "Rap/Hip Hop":
        setSliderRap(value);
        break;
      default:
        break;
    }
  };

  const playlistData = {
    playlistName: playlistName.playlistName,
    genres: [
      { name: "rock", duration: sliderRock },
      { name: "pop", duration: sliderPop },
      { name: "rap/hip hop", duration: sliderRap },
    ],
    points: points,
    repeatArtist: repeatArtists,
  };

  const routeChange = (id) => {
    const path = `/playlists/${id}`;
    history.push(path);
  };

  const generatePlaylist = (data, e) => {
    e.preventDefault();
    fetch(`${HOST}/playlists`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => routeChange(data.id))
      .catch(() => history.push("/500"));
  };

  return (
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Generate your
        <span className="accent-text"> playlist!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group">
          <p>Travel duration: {Math.round(points.duration / 60)} min.</p>
          <label>Playlist name:</label>
          <input
            type="text"
            onChange={(e) => updatePlaylistName("playlistName", e.target.value)}
          />
          <p
            className="register-msg"
            style={
              playlistNameError.properLength
                ? { color: "white" }
                : { color: "red" }
            }
          >
            * Between 3 and 20 chars
          </p>
        </div>
        <table className="genres-list">
          <tbody>
            <tr className="genre-row">
              <td className="genre-col">Rock:</td>
              <td className="slider-col">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderRock}
                  id="slider"
                  onChange={(e) => updateGenres("Rock", e.target.value)}
                />
              </td>
              <td className="percent-col">{sliderRock}%</td>
            </tr>
            <tr className="genre-row">
              <td className="genre-col">Pop:</td>
              <td className="slider-col">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderPop}
                  id="slider"
                  onChange={(e) => updateGenres("Pop", e.target.value)}
                />
              </td>
              <td className="percent-col">{sliderPop}%</td>
            </tr>
            <tr className="genre-row">
              <td className="genre-col">Rap:</td>
              <td className="slider-col">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderRap}
                  id="slider"
                  onChange={(e) => updateGenres("Rap/Hip Hop", e.target.value)}
                />
              </td>
              <td className="percent-col">{sliderRap}%</td>
            </tr>
          </tbody>
        </table>
        <div className="input-group">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="checkbox"
              checked={repeatArtists}
              onChange={() => setRepeatArtists(!repeatArtists)}
            />
            <label>Allow tracks from the same artist</label>
          </div>
          <>
            <p
              className="reminder-msg"
              style={
                points.duration > 150 * 60 && repeatArtists === false
                  ? { color: "red" }
                  : { color: "white" }
              }
            >
              * Allow same artist's tracks if travel duration over 150 min.
            </p>
            {totalDuration < 100 ? (
              <>
                <p className="reminder-msg" style={{ color: "red" }}>
                  * Total of percentages must equal 100
                </p>
                <button
                  type="submit"
                  className="btn"
                  disabled={true}
                  onClick={() => generatePlaylist(playlistData)}
                >
                  Generate Playlist
                </button>
              </>
            ) : (
              <>
                <p className="reminder-msg">
                  * Total of percentages must equal 100
                </p>
                <button
                  type="submit"
                  className="btn"
                  onClick={(e) => generatePlaylist(playlistData, e)}
                >
                  Generate Playlist
                </button>
              </>
            )}
          </>
        </div>
      </form>
    </section>
  );
};

export default GeneratePlaylist;
