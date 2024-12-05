import "./scss/style.scss";
import { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import AuthContextProvider from "./providers/auth-context";
import GuardedRoute from "./providers/GuardedRoute";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Home from "./pages/Home";
import SinglePlaylist from "./pages/SinglePlaylist";
import GenerateRoute from "./pages/GenerateRoute";
import GeneratePlaylist from "./pages/GeneratePlaylist";
import PageNotFound from "./pages/PageNotFound";
import ForgottenPassword from "./pages/ForgottenPassword";

const App = () => {
  const [points, setPoints] = useState({
    duration: 0,
    from: "",
    to: "",
  });

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContextProvider>
          <NavBar />
          <main>
            <Switch>
              <Redirect path="/" exact to="/home" />
              <Route exact path="/home" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route
                exact
                path="/forgotten-password"
                component={ForgottenPassword}
              />
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
              <Route exact path="/playlists/:id" component={SinglePlaylist} />
              <Route path="*" component={PageNotFound} />
            </Switch>
          </main>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
