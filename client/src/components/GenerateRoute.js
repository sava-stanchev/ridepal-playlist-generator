import {useState} from 'react';
import {useHistory} from 'react-router-dom';

const cityNameVerificationError = {
  properCityName: false,
}

const GenerateRoute = ({ setPoints }) => {
  const [cityNameOneError, setCityNameOneError] = useState(cityNameVerificationError);
  const [cityNameTwoError, setCityNameTwoError] = useState(cityNameVerificationError);
  const [route, setRoute] = useState({
    from: '',
    to: '',
  });

  const history = useHistory();
  const routeChange = () =>{ 
    const path = `/generate-playlist`; 
    history.push(path);
  };

  const createRoute = (prop, value) => {
    setRoute({
      ...route,
      [prop]: value,
    });

    if (prop === "from") {
      const properCityName = /^([a-zA-Z\u0080-\u024F]+(?:(\. )|-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(value);
      setCityNameOneError({...cityNameOneError, properCityName});
    }

    if (prop === "to") {
      const properCityName = /^([a-zA-Z\u0080-\u024F]+(?:(\. )|-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(value);
      setCityNameTwoError({...cityNameTwoError, properCityName});
    }
  };

  const getDuration = (e) => {
    e.preventDefault();
    fetch(`http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${route.from}&wp.1=${route.to}&routeAttributes=excludeItinerary&key=AlyPtpHnx-TC4cf6hqJyd2oQKsQwnovawxxxnua_ml-uIxALhwZ__iJg9izB3iHr`, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => setPoints({
      duration: data.resourceSets[0].resources[0].travelDuration,
      from: route.from,
      to: route.to,
    }))
    .catch(error => console.log(error))
    .then(() => routeChange())
  }
  
  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Choose your
        <span className="accent-text"> route!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group">
          <label>From:</label>
          <input type="text" name="from" value={route.from} onChange={e => createRoute('from', e.target.value)}/>
        </div>
        <div className="input-group">
          <label>To:</label>
          <input type="text" name="to" value={route.to} onChange={e => createRoute('to', e.target.value)}/>
        </div>
        <div className="input-group">
          {
            cityNameOneError.properCityName && cityNameTwoError.properCityName ?
            <>
              <p className ="cityReminderMsg">* Travel locations should be valid</p>
              <button type="submit" className="btn" onClick={(e) => getDuration(e)}>Next</button>
            </>
            :
            <>
              <p className ="cityReminderMsg" style={{color: 'red'}}>* Travel locations should be valid</p>
              <button type="submit" className="btn" disabled={true} onClick={(e) => getDuration(e)}>Next</button>
            </>
          }

        </div>
      </form>
    </section>
  )    
};
    
export default GenerateRoute;
  