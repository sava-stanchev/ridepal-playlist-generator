import {useState} from 'react';
import { useHistory } from 'react-router-dom';

const GenerateRoute = () => {
  const [duration, setDuration] = useState(null);
  const [route, setRoute] = useState({
    from: '',
    to: '',
  });

  const history = useHistory();

  const updateRoute = (prop, value) => {
    setRoute({
      ...route,
      [prop]: value,
    });
  };

  console.log(route);
  const getDuration = (ev) => {
    console.log('hi');
    ev.preventDefault();
    fetch(`http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${route.from}&wp.1=${route.to}&routeAttributes=excludeItinerary&key=AlyPtpHnx-TC4cf6hqJyd2oQKsQwnovawxxxnua_ml-uIxALhwZ__iJg9izB3iHr`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => setDuration(data.resourceSets[0].resource[0].travelDuration))
    .catch(error => console.log(error))
  }
  console.log(duration);
  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Choose your
        <span className="accent-text"> route!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group">
          <label>From:</label>
          <input type="text" name="from" value={route.from} onChange={e => updateRoute('from', e.target.value)}/>
        </div>
        <div className="input-group">
          <label>To:</label>
          <input type="text" name="to" value={route.to} onChange={e => updateRoute('to', e.target.value)}/>
        </div>
        <div className="input-group">
          <button type="submit" className="btn"  onSubmit={() => getDuration()}>Next</button>
        </div>
      </form>
    </section>
  )    
};
    
export default GenerateRoute;
  