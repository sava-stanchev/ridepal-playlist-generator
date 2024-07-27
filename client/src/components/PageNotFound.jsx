import { useHistory } from "react-router-dom";

const PageNotFound = () => {
  const history = useHistory();

  return (
    <div className="error">
      <h2>Oops! Page not found.</h2>
      <h1>404</h1>
      <p>We can't find the page you're looking for.</p>
      <button className="error__btn" onClick={() => history.push("/home")}>
        Go back home
      </button>
    </div>
  );
};

export default PageNotFound;
