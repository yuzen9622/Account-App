import React from "react";
import "./console.css";
import Finances from "./categoryType";
import Navsett from "./navsett";
import AccountType from "./accountType";
import { Route, Routes } from "react-router-dom";
import UserSetting from "./UserSetting";

import { Helmet } from "react-helmet-async";
function Console() {
  return (
    <>
      <Helmet>
        <title>設定</title>
      </Helmet>
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
