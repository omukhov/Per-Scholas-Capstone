import { createContext, useContext, useEffect, useRef, useState } from "react";
import type {
  ILoadingContextValue,
  ILoadingProviderProps,
} from "../types/context";

const LoadingContext = createContext<ILoadingContextValue | null>(null);

const MIN_LOADING_TIME = 300;

export function LoadingProvider({ children }: ILoadingProviderProps) {
  const [loading, setLoading] = useState(false);

  const startTime = useRef(0);

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startLoading = () => {
    clearTimeout(timer.current);

    startTime.current = Date.now();

    setLoading(true);
  };

  const stopLoading = () => {
    const elapsedTime = Date.now() - startTime.current;

    const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

    timer.current = setTimeout(() => {
      setLoading(false);
    }, remainingTime);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): ILoadingContextValue {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used inside LoadingProvider");
  }

  return context;
}
