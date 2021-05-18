import {createContext} from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  setAuthState: () => {},
});

export const getUser = () => {
  try {
    return jwt_decode(localStorage.getItem('token') || '');
  } catch (error) {
    return null;
  }
}
export default AuthContext;
