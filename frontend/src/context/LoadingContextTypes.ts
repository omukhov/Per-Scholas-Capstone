import type { ReactNode } from "react";

export interface LoadingContextValue {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export interface LoadingProviderProps {
  children: ReactNode;
}
