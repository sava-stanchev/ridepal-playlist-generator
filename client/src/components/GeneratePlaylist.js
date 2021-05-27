import {useState} from "react";

const GeneratePlaylist = () => {
  const [sliderJazz, setSliderJazz] = useState(0);
  const [sliderRock, setSliderRock] = useState(0);
  const [sliderBlues, setSliderBlues] = useState(0);
  const [sliderDisco, setSliderDisco] = useState(0);
  const [sliderPop, setSliderPop] = useState(0);

  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Create your own
        <span className="accent-text"> playlist!</span>
      </h1>
      <form className="join-login-form">
      <div className="input-group">
          <label>Playlist Name:</label>
          <input type="text"/>
      </div>
      <table className="genres-list">
        <tr className="genre-row">
          <td className="genre-col">Jazz:</td>
          <td className="slider-col">
          <input type="range" min={0} max={100} value={sliderJazz} id="slider" onChange={(e) => setSliderJazz(e.target.value)}/>
          </td>
          <td className="percent-col">{sliderJazz}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Rock:</td>
          <td className="slider-col">
          <input type="range" min={0} max={100} value={sliderRock} id="slider" onChange={(e) => setSliderRock(e.target.value)}/>
          </td>
          <td className="percent-col">{sliderRock}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Blues:</td>
          <td className="slider-col">
          <input type="range" min={0} max={100} value={sliderBlues} id="slider" onChange={(e) => setSliderBlues(e.target.value)}/>
          </td>
          <td className="percent-col">{sliderBlues}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Disco:</td>
          <td className="slider-col">
            <input type="range" min={0} max={100} value={sliderDisco} id="slider" onChange={(e) => setSliderDisco(e.target.value)}/>
          </td>
          <td className="percent-col">{sliderDisco}%</td>
        </tr>
        <tr className="genre-row">
          <td className="genre-col">Pop:</td>
          <td className="slider-col">
            <input type="range" min={0} max={100} value={sliderPop} id="slider" onChange={(e) => setSliderPop(e.target.value)}/>
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
