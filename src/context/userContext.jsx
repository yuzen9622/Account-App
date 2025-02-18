import React, { useEffect, useState } from "react";
import { createContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { url } from "../service";
import { useGoogleLogin } from "@react-oauth/google";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("account-user")
      ? JSON.parse(localStorage.getItem("account-user"))
      : null
  );
  const [userInfo, setUserInfo] = useState({
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    password: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const [token, setToken] = useState(
    sessionStorage.getItem("account-token")
      ? JSON.parse(sessionStorage.getItem("account-token"))
      : null
  );
  const [isLogin, setIsLogin] = useState(user ? true : false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({
    status: "",
    text: "",
    open: false,
  });
  const [driverStep, setDriverStep] = useState(
    localStorage.getItem("hasDriver")
      ? JSON.parse(localStorage.getItem("hasDriver"))
      : []
  );
  const updateError = useCallback((error) => {
    setError(error);
  }, []);
  const [siginInfo, setSiginInfo] = useState({
    name: "",
    password: "",
    email: "",
  });
  useEffect(() => {
    localStorage.setItem("hasDriver", JSON.stringify(driverStep));
  }, [driverStep]);
  const [error, setError] = useState("");
  const navgate = useNavigate();
  const location = useLocation();

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const updateSiginInfo = useCallback((info) => {
    setSiginInfo(info);
  }, []);
  const updateUser = async (e) => {
    e.preventDefault();
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
  const getToken = useCallback(async () => {
    try {
      if (!user) return;
      const res = await fetch(`${url}/users/token`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        sessionStorage.setItem("account-token", JSON.stringify(data.token));
        if (data.refreshToken) {
          let userInfo = JSON.parse(localStorage.getItem("account-user"));
          userInfo.token = data.refreshToken;
          localStorage.setItem("account-user", JSON.stringify(userInfo));
        }
      } else {
        setUser(null);
        localStorage.removeItem("account-user");
        setMessage({
          status: "error",
          text: "token錯誤:請重新登入",
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const getRefreshToken = useCallback(async () => {
    try {
      if (!user) return;
      const res = await fetch(`${url}/users/token`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        let userInfo = JSON.parse(localStorage.getItem("account-user"));
        userInfo.token = data.refreshToken;
        localStorage.setItem("account-user", JSON.stringify(userInfo));
      } else {
        setUser(null);
        localStorage.removeItem("account-user");
        sessionStorage.removeItem("account-token");
        setMessage({
          status: "error",
          text: "登入逾時，請重新登入",
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);
 
  const loginUser = useCallback(async () => {
    try {
      setMessage({ status: "warning", text: "登入中...", open: true });
      const res = await fetch(`${url}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });
      const datas = await res.json();
      if (res.ok) {
        localStorage.setItem("account-user", JSON.stringify(datas));
        navgate("/dash/");
        setUser(datas);
        setMessage({ status: "success", text: "登入成功", open: true });
      } else {
        setMessage({ status: "error", text: datas.error, open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  }, [loginInfo, navgate]);
  const siginUser = useCallback(async () => {
    try {
      setMessage({ status: "warning", text: "註冊中...", open: true });
      const res = await fetch(`${url}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siginInfo),
      });
      const datas = await res.json();
      if (res.ok) {
        localStorage.setItem("account-user", JSON.stringify(datas));

        navgate("/dash/");
        setUser(datas);
        setMessage({ status: "success", text: "註冊成功", open: true });
      } else {
        setMessage({ status: "error", text: datas.error, open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  }, [siginInfo, navgate]);

  const logoutUser = useCallback(() => {
    setIsLogin(false);
    navgate("/account");
    setUser(null);
    setToken(null);
    localStorage.removeItem("account-user");
    sessionStorage.removeItem("account-token");
  }, [navgate]);
  const handleRouteChange = useCallback(() => {
    if (!user && location.pathname !== "/account") {
      navgate("/account");
    }
  }, [location, user, navgate]);

  useEffect(() => {
    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [handleRouteChange]);

  useEffect(() => {
    setIsLogin(token ? true : false);

    if (user && (!token || token === "")) {
      getToken();
      getRefreshToken();
    }
  }, [user, token, getRefreshToken, getToken]);
  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        updateLoginInfo,
        logoutUser,
        loginInfo,
        isLogin,
        error,
        updateSiginInfo,
        siginInfo,
        siginUser,
        token,
        updateError,
        setToken,
        setUser,
        message,
        setMessage,
        userInfo,
        setUserInfo,
        updateUser,
        setIsOpen,
        isOpen,
        setDriverStep,
        driverStep,
      
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
