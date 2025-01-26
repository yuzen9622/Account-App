import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function UserSetting() {
  const { user } = useContext(UserContext);
  return (
    <div className="user-setting">
      <div className="profile">
        <div className="profile-box">
          <label htmlFor="name">名字</label>
          <p>{user.name}</p>
        </div>
        <div className="profile-box">
          <label htmlFor="name">帳號</label>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
}
