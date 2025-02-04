import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { UserContextProvider } from "./context/userContext";
import { HelmetProvider } from "react-helmet-async";
import { ThemeContextProvider } from "./context/themeContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <HelmetProvider>
        <UserContextProvider>
          <ThemeContextProvider>
            <App />
          </ThemeContextProvider>
        </UserContextProvider>
      </HelmetProvider>
    </HashRouter>
  </React.StrictMode>
);
