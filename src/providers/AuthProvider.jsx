"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, onSessionExpired, removeToken, setToken } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!getToken()) {
      Promise.resolve().then(() => active && setLoading(false));
    } else {
      api
        .getMe()
        .then((profile) => active && setUser(profile))
        .catch(() => removeToken())
        .finally(() => active && setLoading(false));
    }

    return () => {
      active = false;
    };
  }, []);

  // A 401 with an expired/invalid token anywhere in the app lands here.
  useEffect(
    () =>
      onSessionExpired((code) => {
        setUser(null);
        toast.error(code === "TOKEN_EXPIRED" ? "Your session expired. Please log in again." : "Please log in again.");
        router.replace("/login");
      }),
    [router, toast]
  );

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (body) => {
    const data = await api.register(body);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await api.getMe();
    setUser(profile);
    return profile;
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser, setUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
