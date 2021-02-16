import React, { createContext, useContext, useMemo } from "react";
import { LoginContext } from "./LoginContext";
import { UserContext } from "./UserContext";

export type PermissionsContextState = {
  canCreateMediaLink: boolean;
};

export const PermissionsContext = createContext<PermissionsContextState>({
  canCreateMediaLink: false,
});

export const PermissionsProvider: React.FC = ({ children }) => {
  const { loggedIn } = useContext(LoginContext);
  const { user, loading: userLoading } = useContext(UserContext);

  const canCreateMediaLink = useMemo(() => {
    const isLoaded = userLoading.loaded;
    const isUser = user.id;
    return loggedIn && isLoaded && isUser;
  }, [userLoading, loggedIn, user]);

  const value = useMemo(() => ({
    canCreateMediaLink,
  }), [userLoading, loggedIn, user]);

  return (
    <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>
  )
}