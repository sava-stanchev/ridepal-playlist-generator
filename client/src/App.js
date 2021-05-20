import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavBar from "./components/Navbar";
import Login from './components/Login';
import Register from './components/Register';
import {useState} from 'react';
import AuthContext, {getUser} from './providers/auth-context';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import StartPage from './components/StartPage';

const App = () => {
  const [authValue, setAuthValue] = useState({
    user: getUser(),
    isLoggedIn: Boolean(getUser()),
  })

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider value = {{...authValue, setAuthState: setAuthValue}}>
          <NavBar />
          <Switch>
            <Redirect path="/" exact to="/home" />
            <Route path="/home" exact component={StartPage}/>
            <Route path="/login" component={Login}/>       
            <Route path="/register" component={Register}/>
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
