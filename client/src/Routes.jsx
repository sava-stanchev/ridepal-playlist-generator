import { Switch, Route, Redirect } from "react-router-dom";
import GuardedRoute from "./providers/GuardedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import SinglePlaylist from "./pages/SinglePlaylist";
import GenerateRoute from "./pages/GenerateRoute";
import GeneratePlaylist from "./pages/GeneratePlaylist";
import ForgottenPassword from "./pages/ForgottenPassword";
import PageNotFound from "./pages/PageNotFound";

const Routes = ({ points, setPoints }) => (
  <Switch>
    <Redirect path="/" exact to="/home" />
    <Route exact path="/home" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/forgotten-password" component={ForgottenPassword} />
    <GuardedRoute exact admin path="/users" component={Users} />
    <GuardedRoute
      exact
      path="/generate-route"
      component={(props) => <GenerateRoute {...props} setPoints={setPoints} />}
    />
    <GuardedRoute
      exact
      path="/generate-playlist"
      component={(props) => <GeneratePlaylist {...props} points={points} />}
    />
    <Route exact path="/playlists/:id" component={SinglePlaylist} />
    <Route path="*" component={PageNotFound} />
  </Switch>
);

export default Routes;
