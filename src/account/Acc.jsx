import React, { useContext } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "./Acc.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContext } from "../context/userContext";
function Acc() {
  const {
    loginUser,
    updateLoginInfo,
    loginInfo,
    siginUser,
    updateSiginInfo,
    siginInfo,

    message,
  } = useContext(UserContext);

  const change = (moment) => {
    if (moment === "login") {
      document.getElementsByClassName("login")[0].style.display = "flex";
      document.getElementsByClassName("sign")[0].style.display = "none";
    } else {
      document.getElementsByClassName("login")[0].style.display = "none";
      document.getElementsByClassName("sign")[0].style.display = "flex";
    }
  };

  return (
    <>
      <div className="acc">
        <div className="acc-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginUser();
            }}
            className="login"
          >
            <h3>登入</h3>
            <div className="user">
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
            <div style={{ display: "flex" }}>
              <p>還沒有帳號嗎?</p>
              <p
                style={{ fontWeight: "600", cursor: "default" }}
                onClick={() => change("sign")}
              >
                註冊
              </p>
            </div>

            <button
              disabled={message.text === "登入中..."}
              onClick={() => loginUser()}
            >
              {message.text === "登入中..." ? "登入中..." : "登入"}
            </button>
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
              <input
                type="email"
                id="sig-name"
                onChange={(e) =>
                  updateSiginInfo({ ...siginInfo, email: e.target.value })
                }
                placeholder="輸入郵件"
              />
            </div>
            <div className="user">
              <input
                type="text"
                id="sig-name"
                onChange={(e) =>
                  updateSiginInfo({ ...siginInfo, name: e.target.value })
                }
                placeholder="輸入名字"
              />
            </div>
            <div className="user">
              <input
                type="password"
                id="sig-pass"
                onChange={(e) =>
                  updateSiginInfo({ ...siginInfo, password: e.target.value })
                }
                placeholder="輸入密碼"
              />
            </div>
            <div style={{ display: "flex" }}>
              <p>已經有帳號?</p>
              <p
                style={{ fontWeight: "600", cursor: "default" }}
                onClick={() => change("login")}
              >
                登入
              </p>
            </div>

            <button disabled={message.text === "註冊中..."} type="submit">
              {message.text === "註冊中..." ? "註冊中..." : "註冊"}
            </button>
          </form>
          <div className="thrid-part">
            <div className="label">
              <p>or</p>
            </div>
            <GoogleOAuthProvider clientId="60970942721-jpde039jkei307mlvcb0j2f9ia2ekfvi.apps.googleusercontent.com">
              <GoogleLoginButton />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default Acc;
