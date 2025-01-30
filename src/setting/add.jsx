import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "./add.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { AccountContext } from "../context/accountContext";
import moment from "moment";
function Add() {
  const {
    accounts,
    categories,
    addNewRecord,
    popOpen,
    setPopOpen,
    selectedDate,
    recordInfo,
    setRecordInfo,
    updateRecord,
    renderRecord,
    setUpdateRecord,
  } = useContext(AccountContext);
  const [sourceCategories, setSourceCategories] = useState(null);

  useEffect(() => {
    if (!updateRecord) return;
    let record = { ...updateRecord };
    record.date = new Date(record.date);
    console.log(record);
    setRecordInfo(record);
  }, [updateRecord, setRecordInfo]);

  useEffect(() => {
    if (!updateRecord) {
      setRecordInfo((prev) => ({
        ...prev,
        categoryId: "",
        toAccountId: null,
      }));
    }

    let fliterCateogries = categories?.filter(
      (item) => item.source === recordInfo.source
    );
    setSourceCategories(fliterCateogries);
  }, [recordInfo.source, setRecordInfo, categories, updateRecord]);
  useEffect(() => {
    if (updateRecord) return;
    let isoDate = new Date(selectedDate);
    isoDate.setDate(isoDate.getDate() + 1);
    if (isoDate > new Date()) {
      setRecordInfo((prev) => ({ ...prev, date: new Date() }));
    } else {
      setRecordInfo((prev) => ({ ...prev, date: isoDate }));
    }
  }, [selectedDate, setRecordInfo, popOpen, updateRecord]);

  return (
    <div
      className="Finances-popbox"
      style={popOpen ? { display: "flex" } : { display: "none" }}
    >
      <div className="popbox-btn">
        <button
          onClick={() =>
            setRecordInfo((prev) => ({ ...prev, source: "expense" }))
          }
          className={recordInfo.source === "expense" ? "pop-active" : "out"}
        >
          支出
        </button>
        <button
          onClick={() =>
            setRecordInfo((prev) => ({ ...prev, source: "income" }))
          }
          className={recordInfo.source === "income" ? "pop-active" : "in"}
        >
          收入
        </button>
        <button
          onClick={() =>
            setRecordInfo((prev) => ({ ...prev, source: "change" }))
          }
          className={recordInfo.source === "change" ? "pop-active" : "in"}
        >
          轉帳
        </button>
      </div>
      <div className="Finances-put">
        <Datetime
          value={recordInfo.date}
          onChange={(e) => {
            if (e._d > new Date()) return;
            console.log(moment());
            setRecordInfo((prev) => ({ ...prev, date: e._d }));
          }}
          inputProps={{ placeholder: "選擇日期", readOnly: true }}
          maxDate={moment()}
          closeOnSelect
          isValidDate={function (current) {
            return current.isBefore(new Date());
          }}
          timeFormat={false}
          locale="zh-tw"
          dateFormat="YYYY-MM-DD"
        />
      </div>
      <div className="Finances-put">
        <p>金額</p>
        <input
          placeholder="$金額"
          type="number"
          inputMode="numeric"
          value={recordInfo.amount}
          onChange={(e) =>
            setRecordInfo((prev) => ({ ...prev, amount: e.target.value }))
          }
        />
      </div>
      <div className="Finances-put">
        <p>帳戶</p>
        <select
          name=""
          id=""
          onChange={(e) =>
            setRecordInfo((prev) => ({ ...prev, accountId: e.target.value }))
          }
          value={recordInfo.accountId}
        >
          <option hidden value={""}>
            --帳戶類--
          </option>
          {accounts &&
            accounts.map((item, key) => (
              <option
                selected={recordInfo.accountId === item._id}
                value={item._id}
                key={key}
              >
                {item.accountsType}
              </option>
            ))}
        </select>
      </div>
      {recordInfo.source === "change" && (
        <div className="Finances-put">
          <p>到帳戶</p>
          <select
            name=""
            id=""
            onChange={(e) =>
              setRecordInfo((prev) => ({
                ...prev,
                toAccountId: e.target.value,
              }))
            }
            value={recordInfo?.toAccountId}
          >
            <option hidden value={""}>
              --帳戶類--
            </option>
            {accounts &&
              accounts.map((item, key) => {
                if (item._id === recordInfo.accountId) return null;
                return (
                  <option
                    selected={recordInfo.toAccountId === item._id}
                    value={item._id}
                    key={key}
                  >
                    {item.accountsType}
                  </option>
                );
              })}
          </select>
        </div>
      )}

      <div className="Finances-put">
        <p>類別</p>
        <select
          name=""
          value={recordInfo.categoryId}
          id=""
          onChange={(e) =>
            setRecordInfo((prev) => ({ ...prev, categoryId: e.target.value }))
          }
        >
          <option hidden value={""}>
            --類別--
          </option>
          {sourceCategories &&
            sourceCategories?.map((item, key) => {
              if (item.isDeleted === false) {
                return (
                  <option
                    key={key}
                    hidden={recordInfo.source !== item.source}
                    value={item._id}
                  >
                    {item.categoriesType}
                  </option>
                );
              }
              return null;
            })}
        </select>
      </div>
      <div className="Finances-put">
        <p>描述</p>
        <input
          type="text"
          name=""
          id=""
          value={recordInfo.description}
          placeholder="描述"
          onChange={(e) =>
            setRecordInfo((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <div className="pop-btn">
        <button
          onClick={() => {
            setPopOpen(false);
            setRecordInfo(renderRecord);
            setUpdateRecord(null);
          }}
        >
          取消
        </button>
        <button onClick={() => addNewRecord()}>確認</button>
      </div>
    </div>
  );
}

export default Add;
