import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/accountContext";
import Record from "./Record";
import "./Dash.css";

export default function DashRecord() {
  const {
    currentRecords,
    setPopOpen,
    popOpen,
    records,
    currentMonth,
    selectedDate,
  } = useContext(AccountContext);
  let isoDate = new Date(selectedDate);
  isoDate.setDate(isoDate.getDate() + 1);
  isoDate.setHours(0, 0, 0, 0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!records) return;
    let come = 0,
      out = 0;
    records.forEach((element) => {
      let eleMonth = new Date(element.date).getMonth() + 1;

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
    <div className="records">
      <h1 style={{ color: "#333", fontWeight: 600 }}>本月收支</h1>
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
          currentRecords.map((item, key) => <Record key={key} record={item} />)}
        {!popOpen && isoDate <= new Date() && (
          <button
            className="plus"
            title="plus"
            onClick={() => setPopOpen(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        )}
      </div>
    </div>
  );
}
