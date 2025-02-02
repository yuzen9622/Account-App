import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import "./user-setting.css";
import { useNavigate } from "react-router-dom";
import { url } from "../service";

export default function UserSetting() {
  const { user, setUser, token, logoutUser, setMessage } =
    useContext(UserContext);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    password: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const edit = async () => {
    try {
      const res = await fetch(`${url}/users/update`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
        setMessage({ status: "success", text: "更改成功", open: true });
        localStorage.setItem("account-user", JSON.stringify(data.user));
        setIsOpen(!isOpen);
      } else {
        setMessage({ status: "warning", text: data.error, open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  };
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
          <form className="profile" onSubmit={edit}>
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
              <label htmlFor="new-password">密碼:</label>
              <input
                type={passwordOpen ? "text" : "password"}
                id="new-password"
                autoComplete="new-password"
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
              <button onClick={() => setIsOpen(!isOpen)}>取消</button>
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
      </div>
    </div>
  );
}
