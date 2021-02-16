import React, { createContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

export type LoginContextState = {
  loggedIn: boolean;
  setLoggedIn(loggedIn: boolean): void;
};

export const LoginContext = createContext<LoginContextState>({
  loggedIn: false,
  setLoggedIn: () => { },
});

export const LoginProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (history.location.search.includes("loggedin=false")) {
      setLoggedIn(false);
    }
  }, [history.location]);

  const value = useMemo(() => ({
    loggedIn,
    setLoggedIn
  }), [
    loggedIn
  ]);

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  )
}