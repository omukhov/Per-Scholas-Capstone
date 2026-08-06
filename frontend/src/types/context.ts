import type { ReactNode } from "react";

export interface ILoadingContextValue {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export interface ILoadingProviderProps {
  children: ReactNode;
}
