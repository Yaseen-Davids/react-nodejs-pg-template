import React, { useEffect, useContext } from "react";

import { useHistory } from "react-router-dom";

import { LoginContext } from "../../contexts/LoginContext";
import { whoami } from "../../lib/user";

export const checkLogin = async (setLoggedIn: any, history: any) => {

  try {
    const resp = await whoami();
    if (resp.status >= 400) {
      throw new Error(resp.statusText);
    }
    setLoggedIn(true);
  } catch (e) {
    history.push("/login/?loggedin=false");
    setLoggedIn(false);
  }
}

export const LoginGuard: React.FunctionComponent<any> = ({ }) => {
  const history = useHistory();

  const { setLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    checkLogin(setLoggedIn, history)
  }, [history.location.pathname]);

  return null;
};