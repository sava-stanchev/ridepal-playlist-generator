import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HOST } from "../common/constants";
import { Slider } from "../components/Slider";
import { joinClasses } from "../common/utils";

const GENRES = ["Rap/Hip Hop", "Pop", "Rock"];
const MAX_DURATION = 100;

const GeneratePlaylist = ({ points }) => {
  const history = useHistory();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistNameError, setPlaylistNameError] = useState(true);
  const [repeatArtists, setRepeatArtists] = useState(false);
  const [genreDurations, setGenreDurations] = useState([50, 35, 15]);

  const handleSliderChange = (index, value) => {
    const newDurations = [...genreDurations];
    newDurations[index] = parseInt(value, 10);
    const remaining = MAX_DURATION - newDurations[index];
    newDurations.forEach((duration, i) => {
      if (i !== index) {
        newDurations[i] =
          (remaining * duration) / (MAX_DURATION - genreDurations[index]);
      }
    });
    setGenreDurations(newDurations);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setPlaylistName(value);
    setPlaylistNameError(!(value.length >= 3 && value.length <= 20));
  };

  const handleCheckboxChange = () => {
    setRepeatArtists(!repeatArtists);
  };

  const generatePlaylistData = () => {
    return {
      playlistName,
      genres: GENRES.map((genre, index) => ({
        name: genre.toLowerCase(),
        duration: genreDurations[index],
      })),
      points,
      repeatArtist: repeatArtists,
    };
  };

  const generatePlaylistRequest = async (data) => {
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
  };

  const isGenerateButtonDisabled = () => {
    return (points.duration > 150 * 60 && !repeatArtists) || playlistNameError;
  };

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
            value={playlistName}
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
          {GENRES.map((genre, index) => (
            <Slider
              key={index}
              index={index}
              value={Math.round(genreDurations[index])}
              title={genre}
              onChange={(e) => handleSliderChange(index, e.target.value)}
            />
          ))}
        </div>
        <div className="generate-playlist__checkbox">
          <input
            type="checkbox"
            id="allow-same-artist"
            className="generate-playlist__checkbox-input"
            checked={repeatArtists}
            onChange={handleCheckboxChange}
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
          disabled={isGenerateButtonDisabled()}
          onClick={() => generatePlaylistRequest(generatePlaylistData())}
        >
          Generate Playlist
        </button>
      </form>
    </section>
  );
};

export default GeneratePlaylist;
