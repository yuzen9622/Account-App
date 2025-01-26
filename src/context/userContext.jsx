import React, { useEffect, useState } from "react";
import { createContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { url } from "../service";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("account-user")
      ? JSON.parse(localStorage.getItem("account-user"))
      : null
  );
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
  const updateError = useCallback((error) => {
    setError(error);
  }, []);
  const [siginInfo, setSiginInfo] = useState({
    name: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState("");
  const navgate = useNavigate();
  const location = useLocation();

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const updateSiginInfo = useCallback((info) => {
    setSiginInfo(info);
  }, []);

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
        navgate("/dash/");
      } else {
        setUser(null);
        localStorage.removeItem("account-user");
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, navgate]);
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
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);
  const loginUser = useCallback(async () => {
    try {
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
      } else {
        setError(datas.error);
      }
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
    }
  }, [loginInfo, navgate]);
  const siginUser = useCallback(async () => {
    try {
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
      } else {
        throw datas.error;
      }
    } catch (error) {
      console.log(error);
    }
  }, [siginInfo, navgate]);

  const logoutUser = useCallback(() => {
    setIsLogin(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("account-user");
    sessionStorage.removeItem("account-token");
  }, []);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
