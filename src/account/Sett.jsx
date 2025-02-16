import React, { useCallback, useContext } from "react";
import "./sett.css";
import { useState, useEffect } from "react";
import moment from "moment";
import { AccountContext } from "../context/accountContext";
import AccountRecord from "../components/accountRecord";
import TotalHeader from "../components/TotalHeader";
import DateRecord from "../components/dateRecord";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { Helmet } from "react-helmet-async";
import DateSelect from "../components/DateSelect";

function Sett() {
  const { records, accounts, filterRecords } = useContext(AccountContext);

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
      if (!filterRecords || !accounts || !_id) return;
      setAccountRecord(null);

      const total = {
        income: 0,
        expense: 0,
        total: 0,
        change: 0,
        account: _id,
      };

      filterRecords?.forEach((item) => {
        const { source, amount, accountId, toAccountId } = item;
        let numberAmount = parseFloat(amount);
        if (source === "income" && accountId === _id) {
          total.income += numberAmount;
          total.total += numberAmount;
        } else if (source === "expense" && accountId === _id) {
          total.expense += numberAmount;
          total.total -= numberAmount;
        } else if (
          source === "change" &&
          (accountId === _id || toAccountId === _id)
        ) {
          if (accountId === _id) {
            total.change -= numberAmount;
            total.total -= numberAmount;
          } else {
            total.change += numberAmount;
            total.total += numberAmount;
          }
        }
      });

      const groupedByDate = filterRecords?.reduce((result, item) => {
        const { date, amount, source, accountId, toAccountId } = item;
        let numberAmount = parseFloat(amount);
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
            record.total += numberAmount;
          } else {
            record.total -= numberAmount;
          }
        }

        return result;
      }, []);
      accounts?.forEach((account) => {
        if (account._id === _id && account.initialAmount) {
          total.total += account.initialAmount;
        }
      });
      setTotalInfo(total);
      groupedByDate.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDateRecord(groupedByDate);
    },
    [accounts, filterRecords]
  );
  useEffect(() => {
    if (!RecordAccountId) {
      setDateRecord(null);
      return;
    }
    fliterRecordByAccountId(RecordAccountId);
  }, [records, RecordAccountId, fliterRecordByAccountId]);

  useEffect(() => {
    if (!filterRecords) return;

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
    filterRecords?.forEach((item) => {
      const { source, amount } = item;
      let numberAmount = parseFloat(amount);
      if (source === "income") {
        setTotalInfo((prev) => ({
          ...prev,
          income: prev.income + numberAmount,
          total: prev.total + numberAmount,
        }));
      } else if (source === "expense") {
        setTotalInfo((prev) => ({
          ...prev,
          expense: prev.expense + numberAmount,
          total: prev.total - numberAmount,
        }));
      }
    });
    const groupedByAccount = filterRecords.reduce((result, item) => {
      const { accountId, amount, source, toAccountId } = item;
      let numberAmount = parseFloat(amount);
      if (!result.find((record) => record._id === accountId)) {
        result.push({ _id: accountId, amount: 0, recordLength: 0 });
      } else if (
        toAccountId &&
        !result.find((record) => record._id === toAccountId)
      ) {
        result.push({ _id: toAccountId, amount: 0, recordLength: 0 });
      }

      const record = result.find((item) => item._id === accountId);
      if (source === "income") {
        record.amount += numberAmount;
      }
      if (source === "expense") {
        record.amount -= numberAmount;
      }
      if (source === "change") {
        if (!result.find((item) => item._id === toAccountId)) {
          result.push({ _id: toAccountId, amount: 0 });
        }

        const account = result.find((item) => item._id === toAccountId);
        account.amount += numberAmount;
        record.amount -= numberAmount;
        account.recordLength += 1;
      }
      record.recordLength += 1;
      return result;
    }, []);
    accounts?.forEach((account) => {
      if (!groupedByAccount.find((item) => item._id === account._id)) {
        groupedByAccount.push({ _id: account._id, amount: 0 });
      }
      let findAccount = groupedByAccount.find(
        (item) => item._id === account._id
      );
      if (groupedByAccount.find((item) => item._id === account._id)) {
        let item = groupedByAccount.find(
          (record) => record._id === account._id
        );
        item.date = account.updatedAt;
      }
      if (account.initialAmount) {
        findAccount.amount += parseFloat(account?.initialAmount);
        setTotalInfo((prev) => ({
          ...prev,
          total: prev.total + parseFloat(account?.initialAmount),
          income: prev.income + parseFloat(account?.initialAmount),
        }));
      }
    });

    groupedByAccount.sort(
      (a, b) => new Date(b.recordLength) - new Date(a.recordLength)
    );
    setAccountRecord(groupedByAccount);
  }, [filterRecords, accounts, dateReocrd]);

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
              <ChevronLeftRoundedIcon style={{ fontSize: "28px" }} />
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
