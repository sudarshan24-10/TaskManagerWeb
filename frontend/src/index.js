import React from "react";
import reactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./Store";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";

const el = document.getElementById("root");
const root = reactDOM.createRoot(el);

root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <App></App>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
