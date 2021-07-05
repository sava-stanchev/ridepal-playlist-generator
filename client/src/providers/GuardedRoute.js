import {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import AuthContext from './auth-context';

const GuardedRoute = ({
  component: Component, admin, ...rest
}) => {
  const {user} = useContext(AuthContext);
  const renderComponent = (props) => {
    if (user) {
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
