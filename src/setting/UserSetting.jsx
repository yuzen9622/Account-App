import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import "./user-setting.css";
import { useNavigate } from "react-router-dom";
import { url } from "../service";
import { ThemeContext } from "../context/themeContext";
import { Radio, Switch, FormControlLabel, Checkbox } from "@mui/material";

export default function UserSetting() {
  const {
    user,
    token,
    logoutUser,
    setMessage,
    updateUser,
    isOpen,
    setIsOpen,
    userInfo,
    setUserInfo,
  } = useContext(UserContext);
  const { setTheme, theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [passwordOpen, setPasswordOpen] = useState(false);

  const destory = async () => {
    try {
      let isCancel = window.confirm("確認註銷?");
      if (!isCancel) return;
      const res = await fetch(`${url}/users/destory`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: user._id }),
      });
      const data = await res.json();
      if (data.ok) {
        logoutUser();
        setMessage({ status: "warning", text: "註銷成功", open: true });
      } else {
        setMessage({ status: "error", text: "註銷失敗", open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器問題", open: true });
    }
  };
  return (
    <div className="user-setting">
      {isOpen && (
        <div className="user-popbox">
          <form className="profile" onSubmit={(e) => updateUser(e)}>
            <div className="profile-box">
              <label htmlFor="name">名字:</label>
              <input
                type="text"
                id="name"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="profile-box">
              <label htmlFor="email">帳號:</label>
              <input
                type="text"
                id="email"
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                value={userInfo.email}
              />
            </div>
            <div className="profile-box">
              <label htmlFor="password">密碼:</label>
              <input
                type={passwordOpen ? "text" : "password"}
                id="password"
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, password: e.target.value }))
                }
                value={userInfo.password}
              />
              <button
                type="button"
                onClick={() => setPasswordOpen(!passwordOpen)}
              >
                {passwordOpen ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>
            <div className="pop-btn">
              <button type="button" onClick={() => setIsOpen(!isOpen)}>
                取消
              </button>
              <button type="submit">更改</button>
            </div>
          </form>
        </div>
      )}

      <div className="top">
        <button onClick={() => navigate("/setting")}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <h3>基本資料</h3>
        <button onClick={() => setIsOpen(!isOpen)}>
          <i className="fa-solid fa-pen-nib"></i>
        </button>
      </div>
      <div className="profile">
        <div className="profile-box">
          <p>名字:{user?.name}</p>
        </div>
        <div className="profile-box">
          <p>帳號:{user?.email}</p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <i className="fa-solid fa-pen-nib"></i> 更改帳號
        </button>
        <button
          onClick={destory}
          style={{ borderColor: "rgb(211, 47, 47)", color: "rgb(211, 47, 47)" }}
        >
          <i className="fa-solid fa-trash-can"></i> 註銷帳號
        </button>
        <div className="profile-box">
          <p>主題</p>
          <Radio
            sx={{
              color: " #FFA500",
              "&.Mui-checked": {
                color: " #FFA500",
              },
            }}
            onChange={() =>
              setTheme((prev) => ({ ...prev, primaryColor: "#FFA500" }))
            }
            value={"#FFA500"}
            checked={theme?.primaryColor === "#FFA500"}
          />
          <Radio
            value={"#20A5EC"}
            onChange={() =>
              setTheme((prev) => ({ ...prev, primaryColor: "#20A5EC" }))
            }
            sx={{
              color: " #20A5EC",
              "&.Mui-checked": {
                color: " #20A5EC",
              },
            }}
            checked={theme?.primaryColor === "#20A5EC"}
          />
          <Radio
            value={"#FFD436"}
            onChange={() =>
              setTheme((prev) => ({ ...prev, primaryColor: "#FFD436" }))
            }
            sx={{
              color: " #FFD436",
              "&.Mui-checked": {
                color: " #FFD436",
              },
            }}
            checked={theme?.primaryColor === "#FFD436"}
          />
        </div>
        <div className="profile-box">
          <p>深色模式</p>
          <Switch
            value={theme?.mode}
            disabled={theme?.system === "inherit"}
            onChange={() => {
              setTheme((prev) => ({
                ...prev,
                mode: theme?.mode === "dark" ? "light" : "dark",
              }));
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "var(--primary-color)",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "var(--primary-color)",
              },
            }}
            checked={theme?.mode === "dark"}
          />
          <FormControlLabel
            onChange={() => {
              setTheme((prev) => ({
                ...prev,
                system: theme?.system === "customize" ? "inherit" : "customize",
              }));
            }}
            checked={theme?.system === "inherit"}
            control={
              <Checkbox
                sx={{
                  color: "var(--text-color)",
                  "&.Mui-checked": {
                    color: "var(--text-color)",
                  },
                }}
              />
            }
            sx={{ color: "var(--text-color)" }}
            label="系統樣式"
          />
        </div>
      </div>
    </div>
  );
}
