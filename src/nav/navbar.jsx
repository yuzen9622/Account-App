import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "../context/userContext";
import { AccountContext } from "../context/accountContext";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
const Navbar = () => {
  const { user } = useContext(UserContext);
  const { setPopOpen } = useContext(AccountContext);

  return (
    <>
      {user ? (
        <div className="nav">
          <div className="name">
            <h1>{user?.name}</h1>
          </div>

          <>
            <nav>
              <li>
                <NavLink to="/dash/">
                  <CalendarMonthIcon color="inherit" />
                  <p>記事本</p>
                </NavLink>
              </li>
              <li>
                <NavLink to="/account">
                  <AccountBalanceIcon color="inherit" />
                  <p>帳戶</p>
                </NavLink>
              </li>
              <li>
                <button onClick={() => setPopOpen(true)}>
                  <AddIcon />
                  <p>記一筆</p>
                </button>
              </li>
              <li>
                <NavLink to="/chart">
                  <InsightsIcon color="inherit" />
                  <p>圖表</p>
                </NavLink>
              </li>
              <li>
                <NavLink to="/setting">
                  <SettingsIcon color="inherit" />
                  <p>設定</p>
                </NavLink>
              </li>
            </nav>
          </>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;
