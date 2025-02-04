import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { url } from "../service";
export const ThemeContext = createContext();
export const ThemeContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [theme, setTheme] = useState({
    primaryColor: user?.theme?.primaryColor || "#FFA500",
    mode: user?.theme?.mode || "#FFA500",
    system: user?.theme?.sysyem || "customize",
  });

  useEffect(() => {
    if (theme.system === "customize") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      setTheme((prev) => ({
        ...prev,
        mode: mediaQuery.matches ? "dark" : "light",
      }));
    };
    console.log(mediaQuery);
    handleThemeChange();

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, [theme]);

  useEffect(() => {
    if (!user) return;
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    user.theme = theme;

    localStorage.setItem("account-user", JSON.stringify(user));
  }, [theme, user]);
  const updateTheme = async () => {
    try {
      const res = await fetch(`${url}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
