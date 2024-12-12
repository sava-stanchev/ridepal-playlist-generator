import { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import { AuthContext } from "./auth-context";

const GuardedRoute = ({ component: Component, admin, ...rest }) => {
  const { user, setUser } = useContext(AuthContext);

  const isTokenExpired = (user) => {
    if (!user || !user.exp) return true;
    const tokenTime = DateTime.fromSeconds(user.exp).toUTC().toMillis();
    const currentTime = DateTime.now().toUTC().toMillis();
    return currentTime > tokenTime;
  };

  useEffect(() => {
    if (user && isTokenExpired(user)) {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.setItem("exp", true);
    }
  }, [user, setUser]);

  const renderComponent = (props) => {
    if (!user || isTokenExpired(user)) {
      return <Redirect to="/login" />;
    }

    if (admin && user.role !== 1) {
      return <Redirect to="/home" />;
    }

    return <Component {...props} />;
  };

  return <Route {...rest} render={renderComponent} />;
};

export default GuardedRoute;
