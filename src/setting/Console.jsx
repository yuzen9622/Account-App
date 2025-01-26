import React, { useContext } from "react";
import "./console.css";
import Finances from "./categoryType";
import Navsett from "./navsett";
import AccountType from "./accountType";
import { Route, Routes } from "react-router-dom";
import UserSetting from "./UserSetting";
import { UserContext } from "../context/userContext";
function Console() {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="console">
        <div className="header">
          <h1>設定</h1>
          <hr />
        </div>
        <Routes>
          <Route path="/" element={<Navsett />} />
          <Route path="/category" element={<Finances />} />
          <Route path="/auth" element={<UserSetting />} />
          <Route path="/account" element={<AccountType />} />
        </Routes>
      </div>
    </>
  );
}

export default Console;
