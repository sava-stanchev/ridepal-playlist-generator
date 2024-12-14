import { createContext, useEffect, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const handleStorageChange = () => setUser(getUser());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
