import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { Slider } from "../components/Slider";

const playlistNameVerificationError = {
  properLength: false,
};

const sliders = ["Rap", "Pop", "Rock"];

const GeneratePlaylist = ({ points }) => {
  const history = useHistory();
  const [playlistName, setPlaylistName] = useState("");
  const [repeatArtists, setRepeatArtists] = useState(false);
  const [playlistNameError, setPlaylistNameError] = useState(
    playlistNameVerificationError
  );
  const [values, setValues] = useState([50, 35, 15]);

  function handleChange(index, value) {
    let maxValue = 100;
    const remaining = maxValue - parseInt(value, 10);
    setValues((vs) =>
      vs.map((v, i) => {
        if (i === index) return parseInt(value, 10);
        const oldRemaining = maxValue - parseInt(vs[index], 10);
        if (oldRemaining) return (remaining * v) / oldRemaining;
        return remaining / (sliders.length - 1);
      })
    );
  }

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

  const playlistData = {
    playlistName: playlistName.playlistName,
    genres: [
      { name: "rap/hip hop", duration: values[0] },
      { name: "pop", duration: values[1] },
      { name: "rock", duration: values[2] },
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
      <form className="main__form generate-playlist">
        <div className="input-group">
          <p className="generate-playlist__travel-duration">
            Travel duration: {Math.round(points.duration / 60)} min.
          </p>
          <label htmlFor="playlist-name">Playlist name:</label>
          <input
            id="playlist-name"
            type="text"
            onChange={(e) => updatePlaylistName("playlistName", e.target.value)}
          />
          <p
            className="validation-msg"
            style={playlistNameError.properLength ? { color: "white" } : {}}
          >
            * Between 3 and 20 chars
          </p>
        </div>
        <div className="generate-playlist__genre-sliders-container">
          {sliders.map((item, index) => (
            <Slider
              key={index}
              index={index}
              value={Math.round(values[index])}
              title={item}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <div>
          <div className="generate-playlist__checkbox">
            <input
              type="checkbox"
              className="generate-playlist__checkbox-input"
              checked={repeatArtists}
              onChange={() => setRepeatArtists(!repeatArtists)}
            />
            <label className="generate-playlist__checkbox-label">
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
            <button
              type="button"
              className="btn"
              disabled={
                points.duration > 150 * 60 && repeatArtists === false
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
