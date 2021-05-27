import {useState} from "react";

const GeneratePlaylist = () => {
  const [sliderOne, setSliderOne] = useState(50);
  const [sliderTwo, setSliderTwo] = useState(50);
  const [sliderThree, setSliderThree] = useState(50);
  const [sliderFour, setSliderFour] = useState(50);
  const [sliderFive, setSliderFive] = useState(50);

  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Choose
        <span className="accent-text"> genres!</span>
      </h1>
      <form className="join-login-form">
        <div className="slider-main">
          <div id="selector">
            <div id="SelectValue">Jazz: {sliderOne}%</div>
          </div>
          <input type="range" min={0} max={100} value={sliderOne} id="slider" onChange={(e) => setSliderOne(e.target.value)}/>
        </div>
        <div className="slider-main">
          <div id="selector">
            <div id="SelectValue">Rock: {sliderTwo}%</div>
          </div>
          <input type="range" min={0} max={100} value={sliderTwo} id="slider" onChange={(e) => setSliderTwo(e.target.value)}/>
        </div>
        <div className="slider-main">
          <div id="selector">
            <div id="SelectValue">Blues: {sliderThree}%</div>
          </div>
          <input type="range" min={0} max={100} value={sliderThree} id="slider" onChange={(e) => setSliderThree(e.target.value)}/>
        </div>
        <div className="slider-main">
          <div id="selector">
            <div id="SelectValue">Disco: {sliderFour}%</div>
          </div>
          <input type="range" min={0} max={100} value={sliderFour} id="slider" onChange={(e) => setSliderFour(e.target.value)}/>
        </div>
        <div className="slider-main">
          <div id="selector">
            <div id="SelectValue">Pop: {sliderFive}%</div>
          </div>
          <input type="range" min={0} max={100} value={sliderFive} id="slider" onChange={(e) => setSliderFive(e.target.value)}/>
        </div>
        <div className="input-group">
          <button type="submit" className="btn">Generate</button>
        </div>
      </form>
    </section>
  )
};

export default GeneratePlaylist;
