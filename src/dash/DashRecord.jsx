import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/accountContext";
import Record from "./Record";
import "./Dash.css";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import moment from "moment";

export default function DashRecord() {
  const {
    currentRecords,
    setPopOpen,
    popOpen,
    records,
    currentMonth,
    selectedDate,
  } = useContext(AccountContext);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!records) return;
    let come = 0,
      out = 0;
    records.forEach((element) => {
      let eleMonth = moment(element.date).format("YYYY-MM");

      if (element.source === "income" && eleMonth === currentMonth) {
        come += element.amount;
      } else if (element.source === "expense" && eleMonth === currentMonth) {
        out += element.amount;
      }
    });
    setExpense(out);
    setIncome(come);
  }, [currentMonth, records]);
  useEffect(() => {
    setTotal(income - expense);
  }, [income, expense]);

  return (
    <div className="records" id="records">
      <h1 style={{ color: "var(--text-color)", fontWeight: 600 }}>本月收支</h1>
      <div className="current-total">
        <p>收入:{income}</p>
        <p>支出:{expense}</p>
        <p
          style={
            total > 0
              ? { color: "#388E3C" }
              : total < 0
              ? { color: "#D32F2F" }
              : {}
          }
        >
          總計:{total}
        </p>
      </div>
      <div className="record-container">
        {currentRecords &&
          currentRecords.map((item) => <Record key={item._id} record={item} />)}
        {!popOpen && selectedDate <= new Date() && (
          <button
            className="plus"
            title="plus"
            style={{ marginTop: "20px" }}
            onClick={() => setPopOpen(true)}
          >
            <AddRoundedIcon />
          </button>
        )}
      </div>
    </div>
  );
}
