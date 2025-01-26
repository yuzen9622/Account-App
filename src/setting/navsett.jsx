import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../context/userContext";
function Navsett() {
  const { logoutUser } = useContext(UserContext);
  return (
    <div className="console">
      <div className="console-btn">
        <div className="btn-p">
          <p>基本設定</p>
        </div>
        <div className="btn">
          <Link to="/setting/category">類別</Link>
          <Link to="/setting/account">帳戶</Link>
          <Link to="">貨幣</Link>
        </div>
        <div className="btn-p">
          <p>帳號設定</p>
        </div>
        <div className="btn">
          <Link to="./auth">基本資料</Link>

          <Link to="/" onClick={() => logoutUser()}>
            登出
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navsett;
