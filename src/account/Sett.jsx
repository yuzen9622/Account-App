import React, { useContext } from "react";
import "./sett.css";
import Datetime from "react-datetime";
import { useState, useEffect } from "react";
import moment from "moment";
import { AccountContext } from "../context/accountContext";
import AccountRecord from "./accountRecord";
import TotalHeader from "./TotalHeader";
import DateRecord from "./dateRecord";
function Sett() {
  const { records, clearQuery, setQueryParams, getRecord, accounts } =
    useContext(AccountContext);
  const [selectedType, setSelectedType] = useState("all");
  const [accountRecord, setAccountRecord] = useState(null);
  const [dateReocrd, setDateRecord] = useState(null);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
  const [end, setEnd] = useState(moment().add(1, "days").format("YYYY-MM-DD"));
  const [totalInfo, setTotalInfo] = useState({
    income: 0,
    expense: 0,
    total: 0,
    change: 0,
    account: "all",
  });

  const fliterRecordByAccountId = (_id) => {
    setAccountRecord(null);
    setTotalInfo((prev) => ({
      ...prev,
      account: _id,
      total: 0,
      income: 0,
      expense: 0,
    }));
    records?.forEach((item) => {
      const { source, amount, accountId, toAccountId } = item;
      if (source === "income" && accountId === _id) {
        setTotalInfo((prev) => ({
          ...prev,
          income: prev.income + amount,
          total: prev.total + amount,
        }));
      } else if (source === "expense" && accountId === _id) {
        setTotalInfo((prev) => ({
          ...prev,
          expense: prev.expense + amount,
          total: prev.total - amount,
        }));
      } else if (
        source === "change" &&
        (accountId === _id || toAccountId === _id)
      ) {
        if (accountId === _id) {
          setTotalInfo((prev) => ({
            ...prev,
            change: prev.change - amount,
            total: prev.total - amount,
          }));
        } else {
          setTotalInfo((prev) => ({
            ...prev,
            change: prev.change + amount,
            total: prev.total + amount,
          }));
        }
      }
    });
    const groupedByDate = records?.reduce((result, item) => {
      const { date, amount, source, accountId, toAccountId } = item;
      if (accountId === _id || toAccountId === _id) {
        if (
          !result.find(
            (record) => record.date === moment(date).format("YYYY-MM-DD")
          )
        ) {
          result.push({
            date: moment(date).format("YYYY-MM-DD"),
            _id: _id,
            records: [],
            total: 0,
          });
        }
        let record = result.find(
          (record) => record.date === moment(date).format("YYYY-MM-DD")
        );
        record.records.push(item);
        if (source === "income" || toAccountId === _id) {
          record.total += amount;
        } else {
          record.total -= amount;
        }
      }

      return result;
    }, []);
    groupedByDate.sort((a, b) => new Date(b.date) - new Date(a.date));
    setDateRecord(groupedByDate);
  };

  useEffect(() => {
    if (!records) return;
    if (dateReocrd) return;

    setTotalInfo({
      expense: 0,
      income: 0,
      total: 0,
      change: 0,
      account: "all",
    });
    records?.forEach((item) => {
      const { source, amount } = item;
      if (source === "income") {
        setTotalInfo((prev) => ({
          ...prev,
          income: prev.income + amount,
          total: prev.total + amount,
        }));
      } else if (source === "expense") {
        setTotalInfo((prev) => ({
          ...prev,
          expense: prev.expense + amount,
          total: prev.total - amount,
        }));
      }
    });
    const groupedByAccount = records.reduce((result, item) => {
      const { accountId, amount, source, toAccountId } = item;
      if (!result.find((record) => record._id === item.accountId)) {
        result.push({ _id: accountId, amount: 0 });
      }
      const record = result.find((item) => item._id === accountId);
      if (source === "income" || toAccountId === record._id) {
        record.amount += parseFloat(amount);
      } else if (source === "expense" || record._id === accountId) {
        record.amount -= parseFloat(amount);
      }
      return result;
    }, []);
    accounts?.forEach((account) => {
      if (!groupedByAccount.find((item) => item._id === account._id)) {
        groupedByAccount.push({ _id: account._id, amount: 0 });
      }
      let findAccount = groupedByAccount.find(
        (item) => item._id === account._id
      );
      findAccount.amount += parseFloat(account.initalAmount);
    });
    console.log(groupedByAccount);
    setAccountRecord(groupedByAccount);
  }, [records, accounts, dateReocrd]);

  useEffect(() => {
    switch (selectedType) {
      case "all":
        clearQuery();
        break;
      case "year":
        setQueryParams({ year });
        break;
      case "month":
        setQueryParams({ year, month });
        break;
      case "dateFrom":
        setQueryParams({ start: start, end: end });
        break;
      default:
        break;
    }
  }, [
    selectedType,
    getRecord,
    end,
    start,
    year,
    month,
    setQueryParams,
    clearQuery,
  ]);

  return (
    <div className="usersett">
      <div className="title">
        <h1>帳戶</h1>
        <hr />
      </div>

      <div className="user-sett">
        <TotalHeader totalInfo={totalInfo} />

        <div className="date">
          <ul>
            <li>
              <button
                className={selectedType === "all" ? "active" : ""}
                onClick={() => {
                  setSelectedType("all");
                }}
              >
                全部
              </button>
            </li>
            <li>
              <button
                className={selectedType === "year" ? "active" : ""}
                onClick={() => {
                  setSelectedType("year");
                }}
              >
                年
              </button>
            </li>
            <li>
              <button
                className={selectedType === "month" ? "active" : ""}
                onClick={() => {
                  setSelectedType("month");
                }}
              >
                月
              </button>
            </li>
            <li>
              <button
                className={selectedType === "dateFrom" ? "active" : ""}
                onClick={() => {
                  setSelectedType("dateFrom");
                }}
              >
                自訂
              </button>
            </li>
          </ul>
        </div>

        <div className="account-tip" id="account-tip">
          {!accountRecord && dateReocrd && (
            <button
              onClick={() => {
                setDateRecord(null);
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <p style={dateReocrd ? { marginRight: "30px" } : {}}>帳戶清單</p>
        </div>
        <div className="date-select">
          {selectedType === "year" && (
            <Datetime
              value={year}
              closeOnSelect
              dateFormat="YYYY"
              inputProps={{ placeholder: "YYYY" }}
              timeFormat={false}
              isValidDate={function (current) {
                return current.isBefore(new Date());
              }}
              onChange={(e) => {
                setYear(e.format("YYYY"));
              }}
            />
          )}

          {selectedType === "month" && (
            <Datetime
              closeOnSelect
              timeFormat={false}
              dateFormat="YYYY-MM"
              value={`${year}-${month}`}
              isValidDate={function (current) {
                return current.isBefore(new Date());
              }}
              inputProps={{ placeholder: "YYYY-MM" }}
              onChange={(e) => {
                setYear(e.format("YYYY"));
                setMonth(e.format("MM"));
              }}
            />
          )}

          {selectedType === "dateFrom" && (
            <>
              <Datetime
                closeOnSelect
                value={start}
                timeFormat={false}
                isValidDate={function (current) {
                  return current.isBefore(new Date(start));
                }}
                onChange={(e) => setStart(e.format("YYYY-MM-DD"))}
                inputProps={{ placeholder: "起始日期" }}
              />
              {"~"}
              <Datetime
                closeOnSelect
                value={end}
                timeFormat={false}
                isValidDate={function (current) {
                  return current.isAfter(new Date(start));
                }}
                onChange={(e) => setEnd(e.format("YYYY-MM-DD"))}
                inputProps={{ placeholder: "結束日期" }}
              />
            </>
          )}
        </div>

        <div className="account-table" id="account-table">
          {!dateReocrd &&
            accountRecord?.map((item, key) => (
              <AccountRecord
                onclick={() => fliterRecordByAccountId(item._id)}
                key={key}
                record={item}
              />
            ))}
          {!accountRecord && dateReocrd?.length > 0
            ? dateReocrd?.map((item, key) => (
                <DateRecord record={item} key={key} />
              ))
            : dateReocrd && <p>No data to display</p>}
        </div>
      </div>
    </div>
  );
}

export default Sett;
