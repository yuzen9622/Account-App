import React, { useContext } from "react";
import { AccountContext } from "../context/accountContext";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AnimatedNumber from "./AnimatedTag";
export default function AccountRecord({ record, onclick }) {
  const { accounts } = useContext(AccountContext);
  const account = accounts?.find((item) => item._id === record?._id);
  return (
    <button className="account-record" onClick={() => onclick()}>
      <div className="record-list">
        <div className="account">
          <p>{account?.accountsType}</p>
        </div>
        <div className="amount-display">
          $<AnimatedNumber number={record.amount} />
          <ChevronRightRoundedIcon style={{ fontSize: "28px" }} />
        </div>
      </div>
    </button>
  );
}
