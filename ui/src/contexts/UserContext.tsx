import React, { createContext, useMemo, useState } from "react";
import { defaultLoading } from "../models/loading";
import { Loading } from "../models/base";
import { whoami } from "../lib/user";

const defaultUser = {
  id: 0,
  email: "",
  username: ""
};

type User = {
  id: number;
  email: string;
  username: string;
}

export type UserContextState = {
  loading: Loading;
  hydrateUser(): void;
  user: User;
};

export const UserContext = createContext<UserContextState>({
  loading: defaultLoading,
  hydrateUser: () => { },
  user: defaultUser
});

export const UserProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<Loading>(defaultLoading);
  const [user, setUser] = useState<User>(defaultUser);

  const hydrateUser = async () => {
    try {
      setLoading({
        loading: true,
        loaded: false,
        error: null,
      });
      const { data } = await whoami();
      setUser(data);
      setLoading({
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error) {
      setLoading({
        loading: false,
        loaded: true,
        error: error,
      });
    }
  }

  const value = useMemo(() => ({
    loading,
    hydrateUser,
    user
  }), [
    loading, ,
    user
  ]);

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  )
}