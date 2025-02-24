import React from "react";
import "./console.css";
import Navsett from "./navsett";
import AccountType from "./accountType";
import CategoryType from "./categoryType";
import { Route, Routes } from "react-router-dom";
import UserSetting from "./UserSetting";
import { Helmet } from "react-helmet-async";
import DataExport from "./DataExport";
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
          <Route path="/category" element={<CategoryType />} />
          <Route path="/auth" element={<UserSetting />} />
          <Route path="/account" element={<AccountType />} />
          <Route path="/export" element={<DataExport />} />
        </Routes>
      </div>
    </>
  );
}

export default Console;
