import React from "react";
import Record from "./Record";
import moment from "moment";
import FormatNumber from "./FormatNumber";
moment.locale("zh-tw");
export default function DateRecord({ record }) {
  const getWeek = (date) => {
    let week = moment(date).day();
    switch (week) {
      case 0:
        return "星期日";
      case 1:
        return "星期一";
      case 2:
        return "星期二";
      case 3:
        return "星期三";
      case 4:
        return "星期四";
      case 5:
        return "星期五";
      case 6:
        return "星期六";
      default:
        return "";
    }
  };
  return (
    <div className="date-record">
      <div className="record-date">
        <p>
          {record.date}
          {getWeek(record.date)}
        </p>
        <p>
          合計:$
          <FormatNumber number={record.total} />
        </p>
      </div>

      <div className="record-container">
        {record &&
          record?.records.map((item, key) => (
            <Record key={key} _id={record._id} record={item} edit={false} />
          ))}
      </div>
    </div>
  );
}
