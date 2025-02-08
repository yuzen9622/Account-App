import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AccountContext } from "../context/accountContext";
import DashRecord from "./DashRecord";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./Dash.css";
import { UserContext } from "../context/userContext";

function Dash() {
  const {
    setSelectedDate,
    selectedDate,
    records,
    setCurrentMonth,
    currentMonth,
    clearQuery,
  } = useContext(AccountContext);
  const { driverStep, setDriverStep } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (driverStep.some((item) => item === "dash")) return;
    const driverObj = driver({
      nextBtnText: "下一步",
      prevBtnText: "上一步",
      doneBtnText: "好好體驗吧!",
      steps: [
        {
          element: ".calendar",
          popover: {
            title: "記帳日歷",
            description: "點擊日期新增紀錄吧",
          },
        },
        {
          element: ".records",
          popover: {
            title: "計帳紀錄",
            description: "計帳紀錄會顯示在這裡 包含本月收支",
          },
        },
        {
          element: ".nav",
          popover: {
            title: "導覽列",
            description: "包含記帳日歷、帳戶、圖表分析、設定",
          },
        },
        {
          element: ".nav li:nth-child(1) a",
          popover: {
            title: "記帳日歷",
            description: "自由新增計帳紀錄 可以修改紀錄和刪除",
          },
        },
        {
          element: ".nav li:nth-child(2) a",
          popover: {
            title: "帳戶清單",
            description: "陳列清楚的帳戶清單以及帳戶記帳歷史",
          },
        },
        {
          element: ".nav li:nth-child(3) button",
          popover: {
            title: "新增",
            description:
              "新增計帳紀錄 包含支出收入和轉帳，轉帳可以是提款、存款、加值...",
          },
        },
        {
          element: ".nav li:nth-child(4) a",
          popover: {
            title: "圖表分析",
            description: "以圖表形式顯示收支 清楚了解收支紀錄",
          },
        },
        {
          element: ".nav li:nth-child(5) a",
          popover: {
            title: "設定",
            description: "可以自由新增類別、帳戶以及基本資料更新和主題更改",
          },
        },
      ],
    });

    driverObj.drive();
    setDriverStep((prev) => [...prev, "dash"]);
  }, [driverStep, setDriverStep]);
  useEffect(() => {
    if (!records) return;

    let groupedData = {}; // 用於分組

    // 按日期和 source 分組，並累積金額與筆數
    records.forEach((record) => {
      const key = `${moment(record.date).format("YYYY-MM-DD")}_${
        record.source
      }`; // 唯一分組標識
      if (!groupedData[key]) {
        groupedData[key] = {
          count: 0,
          totalAmount: 0,
          date: record.date,
          source: record.source,
        };
      }
      groupedData[key].count++;
      groupedData[key].totalAmount += record.amount;
    });
    let eventsData = Object.values(groupedData).map((group, index) => ({
      id: index + 1,
      title: `${group.count > 1 ? `${group.count}筆` : "1筆"}｜$${
        group.totalAmount
      }`,
      source: group.source,
      start: group.date,
      allDay: true,
      color:
        group.source === "income"
          ? "#388E3C"
          : group.source === "expense"
          ? "#D32F2F"
          : "#1976D2",
    }));

    setEvents(eventsData);
  }, [records]);
  useEffect(() => {
    const abbr = document.querySelectorAll("abbr[aria-label]");
    abbr.forEach((el) => {
      if (el.getAttribute("aria-label") === moment().format("YYYY年M月D日")) {
        el.textContent = "今天";
      }
    });
  }, [selectedDate, currentMonth]);
  useEffect(() => {
    clearQuery();
  }, [clearQuery]);
  return (
    <div className="dash">
      <Helmet>
        <title>記帳</title>
      </Helmet>

      <div className="calendar">
        <Calendar
          defaultValue={selectedDate}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e);
          }}
          onActiveStartDateChange={(e) => {
            setSelectedDate(moment(e.activeStartDate).format("YYYY-MM-DD"));
            setCurrentMonth(moment(e.activeStartDate).format("YYYY-MM"));
          }}
          navigationAriaLive="off"
          prev2Label={null}
          next2Label={null}
          onClickDay={(e) => setCurrentMonth(moment(e).format("YYYY-MM"))}
          onClickMonth={(e) => setCurrentMonth(moment(e).format("YYYY-MM"))}
          tileContent={({ date }) => {
            return (
              <>
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      gap: "5px",
                      zIndex: "1",
                    }}
                  >
                    {events.find(
                      (item) =>
                        moment(item.start).format("YYYY-MM-DD") ===
                          moment(date).format("YYYY-MM-DD") &&
                        item.source === "expense"
                    ) && (
                      <div
                        style={{
                          padding: "2.5px",
                          backgroundColor: "#D32F2F",
                          borderRadius: "50px",
                        }}
                      />
                    )}
                    {events.find(
                      (item) =>
                        moment(item.start).format("YYYY-MM-DD") ===
                          moment(date).format("YYYY-MM-DD") &&
                        item.source === "income"
                    ) && (
                      <div
                        style={{
                          padding: "2.5px",
                          backgroundColor: "rgb(56, 205, 9)",
                          borderRadius: "50px",
                        }}
                      />
                    )}
                    {events.find(
                      (item) =>
                        moment(item.start).format("YYYY-MM-DD") ===
                          moment(date).format("YYYY-MM-DD") &&
                        item.source === "change"
                    ) && (
                      <div
                        style={{
                          padding: "2.5px",
                          backgroundColor: "#1976D2",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            );
          }}
        />
      </div>
      <DashRecord />
    </div>
  );
}

export default Dash;
