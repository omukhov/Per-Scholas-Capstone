import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import "leaflet/dist/leaflet.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </Router>
  </StrictMode>,
);
