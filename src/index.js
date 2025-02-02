import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { CustomProvider } from "rsuite";
import { UserContextProvider } from "./context/userContext";
import { HelmetProvider } from "react-helmet-async";
import zhTW from "rsuite/locales/zh_TW";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CustomProvider locale={zhTW}>
      <HashRouter>
        <HelmetProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </HelmetProvider>
      </HashRouter>
    </CustomProvider>
  </React.StrictMode>
);
