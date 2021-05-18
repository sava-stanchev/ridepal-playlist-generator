import './App.css';
import Seed from './components/Seed'
import NavBar from "./components/Navbar";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Seed />
      </BrowserRouter>
    </div>
  );
}

export default App;
