import { useState } from "react";
import { useHistory } from 'react-router-dom';
import { HOST } from '../common/constants.js';

const GeneratePlaylist = ({duration}) => {
  const [sliderJazz, setSliderJazz] = useState(0);
  const [sliderRock, setSliderRock] = useState(0);
  const [sliderBlues, setSliderBlues] = useState(0);
  const [sliderDisco, setSliderDisco] = useState(0);
  const [sliderPop, setSliderPop] = useState(0);
  const [playlistName, setPlaylistName] = useState('');
  const [repeatArtists, setRepeatArtists] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  const updatePlaylistName = (prop, value) => {
    setPlaylistName({
      ...playlistName,
      [prop]: value,
    })
  };

  const updateGenres = (prop, value) => {
    const a = Number(sliderJazz)
      + Number(sliderRock)
      + Number(sliderBlues)
      + Number(sliderDisco)
      + Number(sliderPop) 
      + Number(value)
      - playlistData[prop.toLowerCase()];
      if (a > 100) {
        return;
      }
      setTotalDuration(a);

    switch (prop) {
      case 'Jazz':
        setSliderJazz(value);
        break;
      case 'Rock':
        setSliderRock(value);
        break;
      case 'Blues':
        setSliderBlues(value);
        break;
      case 'Disco':
        setSliderDisco(value);
        break;
      case 'Pop':
        setSliderPop(value);
        break;    
      default:
        break;
    }
  }

  const playlistData= {
    playlistName: playlistName,
    jazz: sliderJazz,
    rock: sliderRock,
    blues: sliderBlues,
    disco: sliderDisco,
    pop: sliderPop,
    duration: duration,
    repeatArtist:repeatArtists,
  };

  const history = useHistory();
  const routeChange = () =>{ 
    const path = `/playlist`; 
    history.push(path);
  };

  const generatePlaylist = (playlistData) => {
    fetch(`${HOST}/playlist`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(playlistData),
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .then(() => routeChange())
    .catch(console.error())

  };

  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Generate your
        <span className="accent-text"> playlist!</span>
      </h1>
      <form className="join-login-form">
      <div className="input-group">
          <p>Travel duration: {Math.round(duration/60)} min.</p>
          <label>Playlist name:</label>
          <input type="text" onChange={(e) => updatePlaylistName('playlistName', e.target.value)}/>
      </div>
      <table className="genres-list">
        <tr className="genre-row">
          <td className="genre-col">Jazz:</td>
          <td className="slider-col">
          <input type="range" min={0} max={100} value={sliderJazz} id="slider" onChange={(e) => updateGenres('Jazz', e.target.value)}/>
          </td>
          <td className="percent-col">{sliderJazz}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Rock:</td>
          <td className="slider-col">
          <input type="range" min={0} max={100} value={sliderRock} id="slider" onChange={(e) => updateGenres('Rock', e.target.value)}/>
          </td>
          <td className="percent-col">{sliderRock}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Blues:</td>
          <td className="slider-col">
          <input type="range" min={0} max={100} value={sliderBlues} id="slider" onChange={(e) => updateGenres('Blues', e.target.value)}/>
          </td>
          <td className="percent-col">{sliderBlues}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Disco:</td>
          <td className="slider-col">
            <input type="range" min={0} max={100} value={sliderDisco} id="slider" onChange={(e) => updateGenres('Disco', e.target.value)}/>
          </td>
          <td className="percent-col">{sliderDisco}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Pop:</td>
          <td className="slider-col">
            <input type="range" min={0} max={100} value={sliderPop} id="slider" onChange={(e) => updateGenres('Pop', e.target.value)}/>
          </td>
          <td className="percent-col">{sliderPop}%</td>
        </tr>
        </table>
        <div className="input-group">
          <div className="checkbox-container">
            <input type="checkbox" id="checkbox" checked={repeatArtists} onChange={() => setRepeatArtists(!repeatArtists)}/>
            <label>Allow tracks from the same artist</label>
          </div>
          <>
            {
              totalDuration < 100
              ?
              <div>
                <p>Total pers mast be 100 %</p>
              </div>
              :
              <button type="submit" className="btn" onClick={() => generatePlaylist(playlistData)}>Generate Playlist</button>
            }
          </>
        </div>
      </form>
    </section>
  )
};

export default GeneratePlaylist;
