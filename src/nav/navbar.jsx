import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "./navbar.css";
import { UserContext } from "../context/userContext";
import { AccountContext } from "../context/accountContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const { message, setMessage, setPopOpen } = useContext(AccountContext);

  return (
    <>
      {user ? (
        <div className="nav">
          <div className="name">
            <h1>{user?.name}</h1>
          </div>
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

          <>
            <nav>
              <li>
                <NavLink to="/dash/">
                  <i className="fa-solid fa-book"></i>
                  <p>記事本</p>
                </NavLink>
              </li>{" "}
              <li>
                <NavLink to="/account">
                  <i className="fa-solid fa-landmark"></i>
                  <p>帳戶</p>
                </NavLink>
              </li>
              <li>
                <button className="plus" onClick={() => setPopOpen(true)}>
                  {" "}
                  <i className="fa-solid fa-plus"></i>
                </button>
              </li>
              <li>
                <NavLink to="/chart">
                  <i className="fa-solid fa-chart-simple"></i>
                  <p>圖表</p>
                </NavLink>
              </li>
              <li>
                <NavLink to="/setting">
                  <i className="fa-solid fa-gear"></i>
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
