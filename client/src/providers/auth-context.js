import {createContext} from 'react';
import decode from 'jwt-decode';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  setAuthState: () => {},
});

export const getUser = () => {
  try {
    return decode(localStorage.getItem('token') || '');
  } catch (error) {
    return null;
  }
}
export default AuthContext;
