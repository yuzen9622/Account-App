import React, { useContext } from "react";
import { AccountContext } from "../context/accountContext";

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
          <p>${record.amount}</p>
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </button>
  );
}
