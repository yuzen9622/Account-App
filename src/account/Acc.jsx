import React, { useContext, useState } from "react";
import "./Acc.css";

import { UserContext } from "../context/userContext";
function Acc() {
  const {
    loginUser,
    updateLoginInfo,
    loginInfo,
    siginUser,
    updateSiginInfo,
    siginInfo,
    error,
    updateError,
  } = useContext(UserContext);
  const [logmoment, setlog] = useState("登入來使用記帳");

  const change = (moment) => {
    let log = document.getElementById("login");
    let sig = document.getElementById("sign");
    if (moment === "login") {
      log.classList.add("active");
      sig.classList.remove("active");
      document.getElementsByClassName("login")[0].style.display = "flex";
      document.getElementsByClassName("sign")[0].style.display = "none";
      setlog("登入來使用記帳");
      updateError("");
    } else {
      log.classList.remove("active");
      sig.classList.add("active");
      document.getElementsByClassName("login")[0].style.display = "none";
      document.getElementsByClassName("sign")[0].style.display = "flex";
      setlog("快來創建帳號");
      updateError("");
    }
  };

  return (
    <>
      <div className="acc">
        <h1>{logmoment}</h1>
        <div className="change">
          <button
            id="login"
            className="active"
            onClick={() => {
              change("login");
            }}
          >
            登入
          </button>
          <button
            id="sign"
            onClick={() => {
              change("sign");
            }}
          >
            註冊
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
          className="login"
        >
          <h3>登入</h3>
          <div className="user">
            <label htmlFor="log-name">郵件 </label>
            <input
              type="email"
              id="log-name"
              value={loginInfo.email}
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, email: e.target.value })
              }
              placeholder="輸入郵件"
            />
          </div>
          <div className="user">
            <label htmlFor="log-pass">密碼 </label>
            <input
              type="password"
              id="log-pass"
              value={loginInfo?.password}
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, password: e.target.value })
              }
              placeholder="輸入密碼"
            />
          </div>
          <p>{error}</p>
          <button onClick={() => loginUser()}>登入</button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            siginUser();
          }}
          className="sign"
        >
          <h3>註冊</h3>

          <div className="user">
            <label htmlFor="sig-name">郵件 </label>
            <input
              type="email"
              id="sig-name"
              onChange={(e) =>
                updateSiginInfo({ ...siginInfo, email: e.target.value })
              }
              placeholder="電子郵件"
            />
          </div>
          <div className="user">
            <label htmlFor="sig-name">名字 </label>
            <input
              type="text"
              id="sig-name"
              onChange={(e) =>
                updateSiginInfo({ ...siginInfo, name: e.target.value })
              }
              placeholder="名字"
            />
          </div>
          <div className="user">
            <label htmlFor="sig-pass">密碼 </label>
            <input
              type="password"
              id="sig-pass"
              onChange={(e) =>
                updateSiginInfo({ ...siginInfo, password: e.target.value })
              }
              placeholder="創建密碼"
            />
          </div>
          <p>{error}</p>
          <button type="submit">註冊</button>
        </form>
      </div>
    </>
  );
}

export default Acc;
