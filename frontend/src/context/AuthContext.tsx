import { createContext, useContext, useState } from "react";

import type {
  IAuthContext,
  IAuthProviderProps,
  IAuthUser,
} from "../types/context";

const AuthContext = createContext<IAuthContext | null>(null);

// Keep user in localhost
const getStoredUser = (): IAuthUser | null => {
  const storedUser = localStorage.getItem("authUser");

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser) as IAuthUser;
};

// Auth context
export function AuthProvider({
  children,
}: IAuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<IAuthUser | null>(getStoredUser);

  const login = (authenticatedUser: IAuthUser): void => {
    localStorage.setItem("authUser", JSON.stringify(authenticatedUser));

    setUser(authenticatedUser);
  };

  const logout = (): void => {
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
