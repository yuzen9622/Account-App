import "./App.css";
import Navbar from "./nav/navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Dash from "./dash/Dash";
import { useContext } from "react";
import Account from "./account/Account";
import Chart from "./chart/Chart";
import Console from "./setting/Console";
import Add from "./setting/add";
import { Snackbar, Alert } from "@mui/material";
import { UserContext } from "./context/userContext";
import { AccountContextProvider } from "./context/accountContext";

function App() {
  const { user, message, setMessage } = useContext(UserContext);

  return (
    <AccountContextProvider>
      <div className="App">
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
