import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const handleThemeChange = useCallback((mediaQuery) => {
    setTheme((prev) => ({
      ...prev,
      mode: mediaQuery.matches ? "dark" : "light",
    }));
  }, []);
  useEffect(() => {
    if (theme.system === "customize") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => handleThemeChange(mediaQuery));
    return () =>
      mediaQuery.removeEventListener("change", () =>
        handleThemeChange(mediaQuery)
      );
  }, [theme, handleThemeChange]);

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
    <ThemeContext.Provider value={{ setTheme, theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
