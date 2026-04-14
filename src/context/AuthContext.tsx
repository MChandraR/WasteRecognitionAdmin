'use client';
import React, {createContext, useContext, useState, useEffect} from "react";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/util/AuthCookies";

interface AuthContextType {
    isAuthenticated: boolean;
    authenticate: (token: string) => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getAuthToken();
        setToken(token || null);
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            if (window.location.pathname !== '/signin') {
            window.location.href = '/signin';
            }
        }
        setIsLoading(false);
    }, []);

    const authenticate = (token: string) => {
        setAuthToken(token);
        setToken(token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        removeAuthToken();
        setToken(null);
        setIsAuthenticated(false);
        window.location.href = '/signin';
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, authenticate, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};