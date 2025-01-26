import "./App.css";
import Navbar from "./nav/navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Dash from "./dash/Dash";
import { useContext } from "react";
import Account from "./account/Account";
import Chart from "./chart/Chart";
import Console from "./setting/Console";

import { UserContext } from "./context/userContext";
import { AccountContextProvider } from "./context/accountContext";

function App() {
  const { user } = useContext(UserContext);

  return (
    <AccountContextProvider>
      <div className="App">
        <Navbar />
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
      </div>
    </AccountContextProvider>
  );
}

export default App;
