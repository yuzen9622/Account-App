import React, { useContext, useEffect, useState } from "react";
import "./splash.css";
import icon from "./記帳-icon.png";
import { ThemeContext } from "../context/themeContext";
export default function Splash({ setEnd }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(
    sessionStorage.getItem("splash") ? false : true
  );
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (!imageLoaded) return;

    setTimeout(() => {
      setLoading(false);

      sessionStorage.setItem("splash", JSON.stringify(true));
    }, 2000);
  }, [imageLoaded]);
  useEffect(() => {
    setEnd(!loading);
  }, [loading, setEnd]);
  return (
    <>
      {loading && (
        <div
          className={`splash ${imageLoaded ? "fade-out" : ""} ${
            theme?.mode === "dark" ? "dark" : ""
          }`}
        >
          <div className={`${imageLoaded ? "scale-out" : ""} splash-container`}>
            <img
              src={icon}
              alt="icon"
              width={100}
              onLoad={() => {
                requestAnimationFrame(() => setImageLoaded(true));
              }}
            />
            <p>微調支出 財富無憂</p>
          </div>
        </div>
      )}
    </>
  );
}
