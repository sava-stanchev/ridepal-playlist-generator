import {useState} from "react";

const GeneratePlaylist = () => {
  const [sliderOne, setSliderOne] = useState(50);

  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Choose
        <span className="accent-text"> genres!</span>
      </h1>
      <form className="join-login-form">
        <div className="slider-main">
          <input type="range" min={0} max={100} value={sliderOne} id="slider" onChange={(e) => setSliderOne(e.target.value)}/>
          <div id="selector">
            <div className="SelectBtn"></div>
            <div id="SelectValue">Jazz: {sliderOne}%</div>
          </div>
        </div>
        <div className="input-group">
          <button type="submit" className="btn">Generate</button>
        </div>
      </form>
    </section>
  )
};

export default GeneratePlaylist;
