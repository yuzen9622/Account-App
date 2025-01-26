import Acc from "./Acc";
import Sett from "./Sett";
import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Account() {
  const { user } = useContext(UserContext);

  return <>{user ? <Sett /> : <Acc />}</>;
}
