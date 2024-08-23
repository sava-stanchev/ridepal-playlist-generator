import { createContext, useState } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const getUser = () => {
  try {
    return jwtDecode(localStorage.getItem("token") || "");
  } catch (error) {
    return null;
  }
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
