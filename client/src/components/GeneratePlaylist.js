import { useState} from "react";

const GeneratePlaylist = () => {
  const duration = localStorage.getItem('duration');
  let totalDuration = 0;

  const [sliderJazz, setSliderJazz] = useState(0);
  const [sliderRock, setSliderRock] = useState(0);
  const [sliderBlues, setSliderBlues] = useState(0);
  const [sliderDisco, setSliderDisco] = useState(0);
  const [sliderPop, setSliderPop] = useState(0);
  const [playlistName, setPlaylistName] = useState('');

  

  const updatePlaylistName = (prop, value) => {
    setPlaylistName({
      ...playlistName,
      [prop]: value,
    })
  };

  const updateGenres = (prop, e) => {
    //const a = playlistData[prop.toLowerCase()];
    console.log(e);
    totalDuration = Number(sliderJazz)
      + Number(sliderRock)
      + Number(sliderBlues)
      + Number(sliderDisco)
      + Number(sliderPop) 
      + Number(e)
      - playlistData[prop.toLowerCase()];
    console.log(totalDuration);
    if (totalDuration>100) {
      console.log('ehooooo');
      return ;
    }
    // ['setSlider' + prop](e);
    switch (prop) {
      case 'Jazz':
        setSliderJazz(e);
        break;
      case 'Rock':
        setSliderRock(e);
        break;
        case 'Blues':
          setSliderBlues(e);
          break;
        case 'Disco':
          setSliderDisco(e);
          break;
        case 'Pop':
          setSliderPop(e);
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
  };

  console.log(playlistName);
  console.log(playlistData);

  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Generate your own
        <span className="accent-text"> playlist!</span>
      </h1>
      <form className="join-login-form">
      <div className="input-group">
          <p>Duration of your travel is: {Math.round(duration/60)} min.</p>
          <label>Please enter playlist name:</label>
          <input type="text" onChange={(e) => updatePlaylistName('playlistName', e.target.value)}/>
      </div>
      <table className="genres-list">
        <tr className="genre-row">
          <td className="genre-col">Jazz:</td>
          <td className="slider-col">
          {/* <input type="range" min={0} max={100} value={sliderJazz} id="slider" onChange={(e) => setSliderJazz(e.target.value)}/> */}
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
          <button type="submit" className="btn">Generate Playlist</button>
        </div>
      </form>
    </section>
  )
};

export default GeneratePlaylist;
