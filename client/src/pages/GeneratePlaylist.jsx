import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { Slider } from "../components/Slider";
import { joinClasses } from "../common/utils";

const sliders = ["Rap", "Pop", "Rock"];

const GeneratePlaylist = ({ points }) => {
  const history = useHistory();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistNameError, setPlaylistNameError] = useState(true);
  const [repeatArtists, setRepeatArtists] = useState(false);
  const [values, setValues] = useState([50, 35, 15]);

  const handleSliderChange = (index, value) => {
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
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setPlaylistName(value);

    if (value.length >= 3 && value.length <= 20) {
      setPlaylistNameError(false);
    } else {
      setPlaylistNameError(true);
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
    <section className="input-page">
      <h1 className="input-page__text">
        Generate your
        <span className="input-page__text--accent"> playlist!</span>
      </h1>
      <form className="input-page__form">
        <div className="input-group">
          <p className="generate-playlist__travel-duration">
            Travel duration: {Math.round(points.duration / 60)} min.
          </p>
          <label htmlFor="playlist-name">Playlist name:</label>
          <input
            id="playlist-name"
            name="playlist-name"
            type="text"
            onChange={handleInputChange}
          />
          <p
            className={joinClasses([
              "input-group__validation-msg",
              !playlistNameError && "input-group__validation-msg--valid",
            ])}
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
              onChange={(e) => handleSliderChange(index, e.target.value)}
            />
          ))}
        </div>
        <>
          <div className="generate-playlist__checkbox">
            <input
              type="checkbox"
              id="allow-same-artist"
              className="generate-playlist__checkbox-input"
              checked={repeatArtists}
              onChange={() => setRepeatArtists(!repeatArtists)}
            />
            <label
              htmlFor="allow-same-artist"
              className="generate-playlist__checkbox-label"
            >
              Allow tracks from the same artist
            </label>
          </div>
          <p
            className="input-page__reminder-msg"
            style={
              points.duration > 150 * 60 && !repeatArtists
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
              (points.duration > 150 * 60 && !repeatArtists) ||
              playlistNameError
            }
            onClick={() => generatePlaylistRequest(playlistData)}
          >
            Generate Playlist
          </button>
        </>
      </form>
    </section>
  );
};

export default GeneratePlaylist;
