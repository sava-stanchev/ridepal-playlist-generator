import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./providers/auth-context";
import NavBar from "./components/Navbar";
import Routes from "./Routes";
import "./scss/style.scss";

const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
        <AuthContextProvider>
          <NavBar />
          <main>
            <Routes />
          </main>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
