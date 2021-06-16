import {useState} from "react";
import {useHistory} from 'react-router-dom';
import {HOST} from '../common/constants.js';

const GeneratePlaylist = ({points}) => {
  const [sliderPop, setSliderPop] = useState(0);
  const [sliderRock, setSliderRock] = useState(0);
  const [sliderRap, setSliderRap] = useState(0);
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
    const sumOfSliders = Number(sliderRock)
      + Number(sliderPop)
      + Number(sliderRap)
      + Number(value)
      - playlistData.genres.filter(g => g.name === prop.toLowerCase())[0].duration;
      if (sumOfSliders > 100) {
        return;
      }
      setTotalDuration(sumOfSliders);
      
    switch (prop) {
      case 'Rock':
        setSliderRock(value);
        break;
      case 'Pop':
        setSliderPop(value);
        break;
      case 'Rap/Hip Hop':
        setSliderRap(value);
        break; 
      default:
        break;
    }
  }
  
  const playlistData = {
    playlistName: playlistName.playlistName,
    genres: [
      {name: 'rock', duration: sliderRock},
      {name: 'pop', duration: sliderPop},
      {name: 'rap/hip hop', duration: sliderRap},
    ],
    points: points,
    repeatArtist: repeatArtists,
  };

  console.log(playlistData);

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
    .then(data => routeChange(data.id))
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
          <p>Travel duration: {Math.round(points.duration/60)} min.</p>
          <label>Playlist name:</label>
          <input type="text" onChange={(e) => updatePlaylistName('playlistName', e.target.value)}/>
        </div>
        <table className="genres-list">
          <tbody>
            <tr className="genre-row">
              <td className="genre-col">Rock:</td>
              <td className="slider-col">
                <input type="range" min={0} max={100} value={sliderRock} id="slider" onChange={(e) => updateGenres('Rock', e.target.value)}/>
              </td>
              <td className="percent-col">{sliderRock}%</td>
            </tr>
            <tr className="genre-row">
              <td className="genre-col">Pop:</td>
              <td className="slider-col">
                <input type="range" min={0} max={100} value={sliderPop} id="slider" onChange={(e) => updateGenres('Pop', e.target.value)}/>
              </td>
              <td className="percent-col">{sliderPop}%</td>
            </tr>
            <tr className="genre-row">
              <td className="genre-col">Rap:</td>
              <td className="slider-col">
                <input type="range" min={0} max={100} value={sliderRap} id="slider" onChange={(e) => updateGenres('Rap/Hip Hop', e.target.value)}/>
              </td>
              <td className="percent-col">{sliderRap}%</td>
            </tr>
          </tbody>
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
              <p className="reminderMsg" style={{color: 'red'}}>* Total of percentages must equal 100</p>
              <button type="submit" className="btn" disabled={true} onClick={() => generatePlaylist(playlistData)}>Generate Playlist</button>
            </>
            :
            <>
              <p className ="reminderMsg">* Total of percentages must equal 100</p>
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
