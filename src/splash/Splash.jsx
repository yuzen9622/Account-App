import React from "react";
import "./splash.css";
import icon from "./記帳-icon.png";
export default function Splash() {
  return (
    <div className="splash fade-out">
      <div className="splash-container">
        <img src={icon} alt="" width={100} />
        <p>微調支出 財富無憂</p>
      </div>
    </div>
  );
}
