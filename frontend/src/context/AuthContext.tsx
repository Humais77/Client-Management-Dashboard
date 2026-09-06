import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import { api } from "../services/api";
import { type User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(
    email: string,
    password: string
  ) {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password
      }
    );

    setUser(response.data.user);
  }

  async function signup(
    name: string,
    email: string,
    password: string
  ) {
    const response = await api.post(
      "/auth/signup",
      {
        name,
        email,
        password
      }
    );

    setUser(response.data.user);
  }

  async function logout() {
    await api.post("/auth/logout");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}