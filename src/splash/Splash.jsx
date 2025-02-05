import React, { useEffect, useState } from "react";
import "./splash.css";
import icon from "./記帳-icon.png";
export default function Splash({ setEnd }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(
    sessionStorage.getItem("splash") ? false : true
  );
  useEffect(() => {
    if (!imageLoaded) return;

    setTimeout(() => {
      setLoading(false);

      sessionStorage.setItem("splash", JSON.stringify(true));
    }, 2500);
  }, [imageLoaded]);
  useEffect(() => {
    setEnd(!loading);
  }, [loading, setEnd]);
  return (
    <>
      {loading && (
        <div className={`splash ${imageLoaded ? "fade-out" : ""}`}>
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
