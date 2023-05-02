import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
  authUserData: {},
  isAuthenticated: false,
  authenticate: (authUserData) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authUserData, setAuthUserData] = useState();
  console.log(AsyncStorage.getItem('authUserData'));

  
  function authenticate(authUserData) {
    setAuthUserData(authUserData);
    AsyncStorage.setItem('authUserData', JSON.stringify(authUserData));
  }

  function logout() {
    setAuthUserData(null);
    AsyncStorage.removeItem('authUserData');
  }

  const value = {
    authUserData: authUserData,
    isAuthenticated: !!authUserData,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
