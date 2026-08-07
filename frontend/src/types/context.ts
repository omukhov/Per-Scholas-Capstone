import type { ReactNode } from "react";

export interface ILoadingContextValue {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export interface ILoadingProviderProps {
  children: ReactNode;
}

export interface IAuthUser {
  _id: string;
  google_id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface IAuthContext {
  user: IAuthUser | null;
  login: (user: IAuthUser) => void;
  logout: () => void;
}

export interface IAuthProviderProps {
  children: ReactNode;
}
