import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "../context/userContext";
import { AccountContext } from "../context/accountContext";

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
                <button onClick={() => setPopOpen(true)}>
                  <i className="fa-solid fa-plus"></i>
                  <p>記一筆</p>
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
