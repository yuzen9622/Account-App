import "./App.css";
import { useState } from "react";
import Navbar from "./nav/navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Dash from "./dash/Dash";
import { useContext } from "react";
import Account from "./account/Account";
import Chart from "./chart/Chart";
import Console from "./setting/Console";
import Add from "./components/Add";
import Splash from "./splash/Splash";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Alert } from "@mui/material";
import { UserContext } from "./context/userContext";
import { AccountContextProvider } from "./context/accountContext";
import { ThemeContext } from "./context/themeContext";

function App() {
  const { user, message, setMessage } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [splashEnd, setSplashEnd] = useState(false);
  if (!splashEnd) return <Splash setEnd={setSplashEnd} />;
  return (
    <AccountContextProvider>
      <div className={`App ${theme?.mode === "dark" ? "dark" : ""}`}>
        <Navbar />

        <Snackbar
          open={message?.open}
          autoHideDuration={3000}
          onClose={(e, reson) => {
            if (reson === "timeout") {
              setMessage((prev) => ({ ...prev, open: false }));
            }
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            style={{ fontWeight: "600" }}
            variant="filled"
            severity={message?.status}
            action={
              message?.status === "success" && (
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setMessage((prev) => ({ ...prev, open: false }));
                  }}
                >
                  <CloseIcon color="inherit" fontSize="inherit" />
                </IconButton>
              )
            }
          >
            {message?.text}
          </Alert>
        </Snackbar>

        <Routes>
          <Route
            path={"/"}
            element={
              user ? <Navigate to="/dash/" /> : <Navigate to="/account" />
            }
          />
          <Route path="/dash" element={<Dash />} />
          <Route path="/account" element={<Account />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/setting/*" element={<Console />} />
        </Routes>
        <Add />
      </div>
    </AccountContextProvider>
  );
}

export default App;
