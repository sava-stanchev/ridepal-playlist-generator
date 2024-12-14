import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./providers/auth-context";
import NavBar from "./components/Navbar";
import Routes from "./Routes";
import "./scss/style.scss";

const App = () => {
  const [points, setPoints] = useState({
    duration: 0,
    from: "",
    to: "",
  });

  return (
    <div className="app-container">
      <BrowserRouter>
        <AuthContextProvider>
          <NavBar />
          <main>
            <Routes points={points} setPoints={setPoints} />
          </main>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
