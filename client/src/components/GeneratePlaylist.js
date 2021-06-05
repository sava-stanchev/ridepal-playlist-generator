import {useState} from "react";
import {useHistory} from 'react-router-dom';
import {HOST} from '../common/constants.js';

const GeneratePlaylist = ({points}) => {
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
    const sumOfSliders = Number(sliderJazz)
      + Number(sliderRock)
      + Number(sliderBlues)
      + Number(sliderDisco)
      + Number(sliderPop) 
      + Number(value)
      - playlistData.genres.filter(g => g.name === prop.toLowerCase())[0].duration;
      if (sumOfSliders > 100) {
        return;
      }
      setTotalDuration(sumOfSliders);
      
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

  
  const playlistData = {
    playlistName: playlistName.playlistName,
    genres: [
      {name: 'jazz', duration: sliderJazz},
      {name: 'rock', duration: sliderRock},
      {name: 'blues', duration: sliderBlues},
      {name: 'disco', duration: sliderDisco},
      {name: 'pop', duration: sliderPop},
    ],
    points: points,
    repeatArtist: repeatArtists,
  };

  const history = useHistory();
  const routeChange = (id) =>{ 
    const path = `/playlists/${id}`; 
    history.push(path);
  };

  const generatePlaylist = (data, e) => {
    e.preventDefault();
    fetch(`${HOST}/playlist`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(data => routeChange(data.playlists_id))
    .catch(console.error())
  };
  console.log(playlistData.genres);
  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Generate your
        <span className="accent-text"> playlist!</span>
      </h1>
      <form className="join-login-form">
      <div className="input-group">
          <p>Travel duration: {Math.round(points.duration/60)} min.</p>
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
              <>
              <p className="reminderMsg" style={{color: 'red'}}>* total of percentages must equal 100</p>
              <button type="submit" className="btn" disabled="true" onClick={() => generatePlaylist(playlistData)}>Generate Playlist</button>
              </>
              :
              <>
              <p className ="reminderMsg">* total of percentages must equal 100</p>
              <button type ='submit' className="btn" onClick={(e) => generatePlaylist(playlistData, e)}>Generate Playlist</button>
              </>
            }
          </>
        </div>
      </form>
    </section>
  )
};

export default GeneratePlaylist;
