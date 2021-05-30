import './App.css';
import NavBar from "./components/Navbar";
import Login from './components/Login';
import Register from './components/Register';
import {useState} from 'react';
import AuthContext, {getUser} from './providers/auth-context';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import StartPage from './components/StartPage';
import ViewPlaylist from './components/ViewPlaylist';
import GenerateRoute from './components/GenerateRoute';
import GeneratePlaylist from './components/GeneratePlaylist';

const App = () => {
  const [authValue, setAuthValue] = useState({
    user: getUser(),
    isLoggedIn: Boolean(getUser()),
  })

  const [points, setPoints] = useState({
    duration: 0,
    from: '',
    to: '',
  });

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider value = {{...authValue, setAuthState: setAuthValue}}>
          <NavBar />
          <Switch>
            <Redirect path="/" exact to="/home" />
            <Route path="/home" exact component={StartPage} />
            <Route path="/login" exact component={Login} />       
            <Route path="/register" exact component={Register} />
            <Route path="/generate-route" exact component={(props) => <GenerateRoute {...props} setPoints={setPoints}/>} />
            <Route path="/generate-playlist" exact component={(props) => <GeneratePlaylist {...props} points={points}/>} />
            <Route path="/playlists/:id" exact component={ViewPlaylist} />
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
