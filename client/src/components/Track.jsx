import PropTypes from "prop-types";
import { trackTimeFormat } from "../common/utils";

const Track = ({ cover, artist_name, track_title, duration, preview }) => (
  <tr className="song">
    <td className="song__cover">
      <div className="song__cover-img">
        <img src={cover} alt="cover" />
      </div>
    </td>
    <td className="song__title">
      <h5>
        {artist_name} - {track_title}
      </h5>
    </td>
    <td>
      <h5>{trackTimeFormat(duration)}</h5>
    </td>
    <td>
      <audio controls className="song__audio" controlsList="nodownload">
        <source src={preview} type="audio/mp3" />
      </audio>
    </td>
  </tr>
);

Track.propTypes = {
  cover: PropTypes.string.isRequired,
  artist_name: PropTypes.string.isRequired,
  track_title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  preview: PropTypes.string.isRequired,
};

export default Track;
