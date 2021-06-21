import {useHistory} from 'react-router-dom';

const ServerError = () => {
  const history = useHistory();

  return (
    <div className="error-container">
      <h2>Oops! Something went wrong.</h2>
      <h1>500</h1>
      <p>Our developers are working on fixing the server issue.</p>
      <button className="error-btn" onClick={() => history.push('/home')}>Go back home</button>
    </div>
  );
};

export default ServerError;
