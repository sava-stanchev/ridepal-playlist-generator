import "./scss/style.scss";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Users from "./components/Users";
import { useState } from "react";
import AuthContext, { getUser } from "./providers/auth-context";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import StartPage from "./components/StartPage";
import ViewPlaylist from "./components/ViewPlaylist";
import GenerateRoute from "./components/GenerateRoute";
import GeneratePlaylist from "./components/GeneratePlaylist";
import PageNotFound from "./components/PageNotFound";
import ServerError from "./components/ServerError";
import GuardedRoute from "./providers/GuardedRoute";

const App = () => {
  const [authValue, setAuthValue] = useState({
    user: getUser(),
    isLoggedIn: Boolean(getUser()),
  });

  const [points, setPoints] = useState({
    duration: 0,
    from: "",
    to: "",
  });

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider
          value={{ ...authValue, setAuthState: setAuthValue }}
        >
          <NavBar />
          <Switch>
            <Redirect path="/" exact to="/home" />
            <Route exact path="/home" component={StartPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <GuardedRoute exact admin path="/users" component={Users} />
            <GuardedRoute
              exact
              path="/generate-route"
              component={(props) => (
                <GenerateRoute {...props} setPoints={setPoints} />
              )}
            />
            <GuardedRoute
              exact
              path="/generate-playlist"
              component={(props) => (
                <GeneratePlaylist {...props} points={points} />
              )}
            />
            <Route exact path="/playlists/:id" component={ViewPlaylist} />
            <Route path="/500" component={ServerError} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
