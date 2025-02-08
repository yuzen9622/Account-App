import React, { useCallback, useContext } from "react";
import "./sett.css";
import Datetime from "react-datetime";
import { useState, useEffect } from "react";
import moment from "moment";
import { AccountContext } from "../context/accountContext";
import AccountRecord from "./accountRecord";
import TotalHeader from "./TotalHeader";
import DateRecord from "./dateRecord";
import { Helmet } from "react-helmet-async";
import DateSelect from "../components/DateSelect";

function Sett() {
  const { records, accounts } = useContext(AccountContext);

  const [accountRecord, setAccountRecord] = useState(null);
  const [dateReocrd, setDateRecord] = useState(null);
  const [RecordAccountId, setRecordAccountId] = useState(null);
  const [totalInfo, setTotalInfo] = useState({
    income: 0,
    expense: 0,
    total: 0,
    change: 0,
    account: "all",
  });
  const fliterRecordByAccountId = useCallback(
    (_id) => {
      if (!records || !accounts || !_id) return;
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
      accounts?.forEach((account) => {
        if (account._id === _id) {
          setTotalInfo((prev) => ({
            ...prev,
            total: prev.total + parseFloat(account?.initalAmount),
          }));
        }
      });
      groupedByDate.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDateRecord(groupedByDate);
    },
    [accounts, records]
  );
  useEffect(() => {
    if (!RecordAccountId) {
      setDateRecord(null);
      return;
    }
    fliterRecordByAccountId(RecordAccountId);
  }, [records, RecordAccountId, fliterRecordByAccountId]);
  useEffect(() => {
    if (!records) return;

    if (dateReocrd) {
      return;
    }

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
      if (!result.find((record) => record._id === accountId)) {
        result.push({ _id: accountId, amount: 0 });
      } else if (
        toAccountId &&
        !result.find((record) => record._id === toAccountId)
      ) {
        result.push({ _id: toAccountId, amount: 0 });
      }
      const record = result.find((item) => item._id === accountId);
      if (source === "income") {
        record.amount += parseFloat(amount);
      }
      if (source === "expense") {
        record.amount -= parseFloat(amount);
      }
      if (source === "change") {
        if (!result.find((item) => item._id === toAccountId)) {
          result.push({ _id: toAccountId, amount: 0 });
        }
        const account = result.find((item) => item._id === toAccountId);
        account.amount += parseFloat(amount);
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
      setTotalInfo((prev) => ({
        ...prev,
        total: prev.total + parseFloat(account.initalAmount),
        income: prev.income + parseFloat(account.initalAmount),
      }));
    });
    groupedByAccount.sort((a, b) => b.amount - a.amount);
    setAccountRecord(groupedByAccount);
  }, [records, accounts, dateReocrd]);

  return (
    <div className="usersett">
      <Helmet>
        <title>帳戶</title>
      </Helmet>
      <div className="title">
        <h1>帳戶</h1>
        <hr />
      </div>

      <div className="user-sett">
        <TotalHeader totalInfo={totalInfo} />

        <DateSelect />

        <div className="account-tip" id="account-tip">
          {!accountRecord && dateReocrd && (
            <button
              onClick={() => {
                setRecordAccountId(null);
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <p style={dateReocrd ? { marginRight: "30px" } : {}}>帳戶清單</p>
        </div>

        <div className="account-table" id="account-table">
          {!dateReocrd &&
            accountRecord?.map((item, key) => (
              <AccountRecord
                onclick={() => setRecordAccountId(item._id)}
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
