import React, { useState, useEffect, useContext } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import { AccountContext } from "../context/accountContext";
export default function DateSelect() {
  const [selectedType, setSelectedType] = useState("all");
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [start, setStart] = useState(moment().format("YYYY/MM/DD"));
  const [end, setEnd] = useState(moment().add(1, "days").format("YYYY/MM/DD"));
  const { getRecord, clearQuery, setQueryParams } = useContext(AccountContext);
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
    <div>
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
      <div className="date-select">
        {selectedType === "year" && (
          <Datetime
            value={year}
            closeOnSelect
            dateFormat="YYYY"
            inputProps={{ placeholder: "YYYY", readOnly: true }}
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
            dateFormat="YYYY/MM"
            value={`${year}/${month}`}
            isValidDate={function (current) {
              return current.isBefore(new Date());
            }}
            inputProps={{ placeholder: "YYYY-MM", readOnly: true }}
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
                return current.isBefore();
              }}
              onChange={(e) => setStart(e.format("YYYY/MM/DD"))}
              inputProps={{ placeholder: "起始日期", readOnly: true }}
            />
            {"~"}
            <Datetime
              closeOnSelect
              value={end}
              timeFormat={false}
              isValidDate={function (current) {
                return current.isAfter(new Date(start));
              }}
              onChange={(e) => setEnd(e.format("YYYY/MM/DD"))}
              inputProps={{ placeholder: "結束日期", readOnly: true }}
            />
          </>
        )}
      </div>
    </div>
  );
}
