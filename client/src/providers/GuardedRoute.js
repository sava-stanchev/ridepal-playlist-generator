import {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {DateTime} from 'luxon';
import AuthContext from './auth-context';

const GuardedRoute = ({
  component: Component, admin, ...rest
}) => {
  const {user, setUser} = useContext(AuthContext);
  const renderComponent = (props) => {
    if (user) {
      const tokenTime = DateTime.fromSeconds(user.exp).toUTC().toMillis();
      const currentTime = DateTime.now().toUTC().toMillis();

      if (currentTime > tokenTime) {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.setItem('exp', true);

        return <Redirect to='/login' />;
      }

      if (!admin || (admin && user.role === 1)) {
        return <Component {...props} />;
      }

      return <Redirect to='/home' />;
    }

    return <Redirect to='/login' />;
  };

  return (
    <Route
      {...rest}
      render={renderComponent}
    />
  );
};

export default GuardedRoute;
