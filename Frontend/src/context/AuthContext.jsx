import { createContext, useContext, useState, useCallback } from "react";

/**
 * AuthContext
 *
 * Provides reactive auth state to the entire component tree.
 * Components consume auth via the `useAuth` hook instead of
 * reading localStorage directly on every render.
 *
 * Exported values:
 *   isLoggedIn {boolean}       — true when a JWT is present in localStorage
 *   login(token) {function}    — stores the token and marks the user logged in
 *   logout()    {function}     — removes the token and marks the user logged out
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage so a page refresh preserves auth state.
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("googleToken");
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — consume the auth context from any child component.
 *
 * Throws if used outside of <AuthProvider> to surface misconfiguration early.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
