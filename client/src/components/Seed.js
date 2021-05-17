import { useState } from 'react';
import Loader from './Loader';

const Seed = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState(null);

  const mainGenres = () => {
    setLoader(true);
    fetch(`https://api.deezer.com/genre/`, {
      method: 'GET',
      mode: 'no-cors',
    })
    .then(res => res.json())
    .then(data =>setGenres(data))
    .then(() => setLoader(false))
    .catch(error => setError(error.message));
  };

  const showLoader = () =>  {
    if(loader) {
      return <Loader />;
    }
  };

  return (
    <div>
      
      {showLoader()}
      <button onClick={() => mainGenres()}> Take data for genres! </button>
    </div>

  )
};

export default Seed;