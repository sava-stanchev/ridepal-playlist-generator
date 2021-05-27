import {useState} from "react";

const GeneratePlaylist = () => {
  const [sliderJazz, setSliderJazz] = useState(50);
  const [sliderRock, setSliderRock] = useState(50);
  const [sliderBlues, setSliderBlues] = useState(50);
  const [sliderDisco, setSliderDisco] = useState(50);
  const [sliderPop, setSliderPop] = useState(50);

  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Choose
        <span className="accent-text"> genres!</span>
      </h1>
      <form className="join-login-form">
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
          <button type="submit" className="btn">Generate</button>
        </div>
      </form>
    </section>
  )
};

export default GeneratePlaylist;
