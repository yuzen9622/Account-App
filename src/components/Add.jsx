import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "./add.css";
import Datetime from "react-datetime";
import { useNavigate } from "react-router-dom";
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
    updateRecordInfo,
    updateRecord,
    renderRecord,
    setUpdateRecordInfo,
  } = useContext(AccountContext);
  const [sourceCategories, setSourceCategories] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!updateRecordInfo) return;
    let record = { ...updateRecordInfo };
    record.date = new Date(record.date);

    setRecordInfo(record);
  }, [updateRecordInfo, setRecordInfo]);
  useEffect(() => {
    setRecordInfo((prev) => ({
      ...prev,
      categoryId: "",
      toAccountId: "",
    }));
  }, [recordInfo.source, setRecordInfo]);

  useEffect(() => {
    if (!updateRecordInfo) {
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
  }, [recordInfo.source, setRecordInfo, categories, updateRecordInfo]);
  useEffect(() => {
    if (updateRecordInfo) return;
    // let isoDate = new Date(selectedDate);
    // isoDate.setDate(isoDate.getDate() + 1);
    if (selectedDate > new Date()) {
      setRecordInfo((prev) => ({ ...prev, date: new Date() }));
    } else {
      setRecordInfo((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate, setRecordInfo, popOpen, updateRecordInfo]);

  return (
    <div
      className="Finances-popbox"
      style={popOpen ? { display: "flex" } : { display: "none" }}
    >
      <div className="container">
        <button
          onClick={() => {
            navigate("/setting/account");
            setPopOpen(false);
          }}
          className={"in"}
        >
          編輯帳戶
        </button>
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
        <button
          onClick={() => {
            navigate("/setting/category");
            setPopOpen(false);
          }}
          className={"in"}
        >
          編輯類別
        </button>
      </div>

      <div className="Finances-put">
        <Datetime
          value={recordInfo.date}
          onChange={(e) => {
            if (e._i > new Date()) return;

            setRecordInfo((prev) => ({
              ...prev,
              date: e.format("YYYY/MM/DD"),
            }));
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
        <p>備註</p>
        <input
          type="text"
          name=""
          id=""
          value={recordInfo.description}
          placeholder="備註"
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
            setUpdateRecordInfo(null);
          }}
        >
          取消
        </button>
        <button
          onClick={() => {
            if (!updateRecordInfo) {
              addNewRecord();
            } else {
              updateRecord();
            }
          }}
        >
          確認
        </button>
      </div>
    </div>
  );
}

export default Add;
