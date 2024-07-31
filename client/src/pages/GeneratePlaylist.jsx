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

  async function generatePlaylistRequest(data) {
    try {
      const response = await fetch(`${HOST}/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        const path = `/playlists/${result.id}`;
        history.push(path);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <section className="main">
      <h1 className="main__text">
        Generate your
        <span className="main__text--accent"> playlist!</span>
      </h1>
      <form className="main__form">
        <div className="input-group">
          <p className="travel-duration">
            Travel duration: {Math.round(points.duration / 60)} min.
          </p>
          <label>Playlist name:</label>
          <input
            type="text"
            onChange={(e) => updatePlaylistName("playlistName", e.target.value)}
          />
          <p
            className="validation-msg"
            style={
              playlistNameError.properLength
                ? { color: "white" }
                : { color: "red" }
            }
          >
            * Between 3 and 20 chars
          </p>
        </div>
        <table className="genres">
          <tbody>
            <tr className="genres__row">
              <td className="genres__col">Rock:</td>
              <td className="slider">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderRock}
                  className="slider__input"
                  onChange={(e) => updateGenres("Rock", e.target.value)}
                />
              </td>
              <td className="genres__percent">{sliderRock}%</td>
            </tr>
            <tr className="genres__row">
              <td className="genres__col">Pop:</td>
              <td className="slider">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderPop}
                  className="slider__input"
                  onChange={(e) => updateGenres("Pop", e.target.value)}
                />
              </td>
              <td className="genres__percent">{sliderPop}%</td>
            </tr>
            <tr className="genres__row">
              <td className="genres__col">Rap:</td>
              <td className="slider">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderRap}
                  className="slider__input"
                  onChange={(e) => updateGenres("Rap/Hip Hop", e.target.value)}
                />
              </td>
              <td className="genres__percent">{sliderRap}%</td>
            </tr>
          </tbody>
        </table>
        <div className="input-group">
          <div className="checkbox">
            <input
              type="checkbox"
              className="checkbox__input"
              checked={repeatArtists}
              onChange={() => setRepeatArtists(!repeatArtists)}
            />
            <label className="checkbox__label">
              Allow tracks from the same artist
            </label>
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
            <p
              className="reminder-msg"
              style={{ color: totalDuration < 100 ? "red" : "white" }}
            >
              * Total of percentages must equal 100
            </p>
            <button
              type="button"
              className="btn"
              disabled={
                totalDuration < 100 ||
                (points.duration > 150 * 60 && repeatArtists === false)
                  ? true
                  : false
              }
              onClick={() => generatePlaylistRequest(playlistData)}
            >
              Generate Playlist
            </button>
          </>
        </div>
      </form>
    </section>
  );
};

export default GeneratePlaylist;
