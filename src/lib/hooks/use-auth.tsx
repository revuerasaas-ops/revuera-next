"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  subscriptionStatus: string;
  googleReviewLink: string;
  shortcode: string;
  contactLimit: number;
  contactsUsed: number;
  trialEnd: string;
  verified: boolean;
};

type AuthContextType = {
  user: UserData | null;
  sessionToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("rv_company");
      const storedToken = localStorage.getItem("rv_session");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setSessionToken(storedToken);
      }
    } catch {
      // Invalid data, clear
      localStorage.removeItem("rv_company");
      localStorage.removeItem("rv_session");
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, userData: UserData) => {
    localStorage.setItem("rv_session", token);
    localStorage.setItem("rv_company", JSON.stringify(userData));
    setSessionToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("rv_session");
    localStorage.removeItem("rv_company");
    setSessionToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("rv_company", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        isLoading,
        isAuthenticated: !!user && !!sessionToken,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
