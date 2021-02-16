import React, { createContext, useEffect, useMemo, useState } from "react";

import { tokenLogin } from "../lib/user";

export type TokenLoginContextState = {
  loading: boolean;
};

export const TokenLoginContext = createContext<TokenLoginContextState>({
  loading: false,
});

export const TokenLoginProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>(localStorage.getItem("login-token") || "");

  const doTokenLogin = async () => {
    try {
      setLoading(true);
      await tokenLogin({ username: token || "", password: token || "" });
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    doTokenLogin();
  }, []);

  const value = useMemo(() => ({
    loading,
  }), [loading]);

  if (loading) {
    return <TokenLoginContext.Provider value={value}>
      <div style={{ height: "100vh", width: "100vw", backgroundColor: "#111" }}></div>
    </TokenLoginContext.Provider>
  }

  return (
    <TokenLoginContext.Provider value={value}>{children}</TokenLoginContext.Provider>
  )
}