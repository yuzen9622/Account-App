import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AccountContext } from "../context/accountContext";
import DashRecord from "./DashRecord";
import { Helmet } from "react-helmet-async";
import moment from "moment";

import "./Dash.css";

function Dash() {
  const { setSelectedDate, selectedDate, records, setCurrentMonth } =
    useContext(AccountContext);
  const [events, setEvents] = useState([]);
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
    console.log(eventsData);

    setEvents(eventsData);
  }, [records]);
  useEffect(() => {
    const abbr = document.querySelectorAll("abbr[aria-label]");
    abbr.forEach((el) => {
      console.log(
        moment().format("YYYY年M月D日"),
        el.getAttribute("aria-label")
      );

      if (el.getAttribute("aria-label") === moment().format("YYYY年M月D日")) {
        el.textContent = "今天";
      }
    });
  }, []);
  // const handleTodayClick = () => {
  //   const calendarApi = calendarRef.current.getApi();
  //   const today = moment().add(-1, "days").format("YYYY-MM-DD");

  //   // 設定選定日期並跳到本月
  //   setSelectedDate(today);

  //   calendarApi.gotoDate(today); // 跳到當前日期的月份
  //   setTimeout(() => {
  //     const todayCell = document.querySelector(
  //       `[data-date="${moment().format("YYYY-MM-DD")}"]`
  //     );
  //     if (todayCell) {
  //       todayCell.scrollIntoView({ block: "center" });
  //     }
  //   }, 0);
  // };

  return (
    <div className="dash">
      <Helmet>
        <title>記帳</title>
      </Helmet>

      <div className="calendar">
        <Calendar
          defaultValue={selectedDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e)}
          onActiveStartDateChange={(e) => {
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
        {/* <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[dayGridPlugin, interactionPlugin]}
          locale={locale}
          customButtons={{
            customToday: {
              text: "今天",
              click: handleTodayClick,
            },
          }}
          initialView="dayGridMonth"
          aspectRatio={0.5}
          select={(info) => {
            const localDate = info.start.toISOString().split("T")[0]; // 確保格式為 YYYY-MM-DD
            setSelectedDate(localDate);
          }}
          eventClick={(info) => {
            const localDate = info.event.start.toISOString().split("T")[0];
            setSelectedDate(localDate);
          }}
          eventTimeFormat={{
            hour: "2-digit",
          }}
          eventDisplay="block"
          longPressDelay={30}
          initialDate={selectedDate}
          dayCellClassNames={(arg) => {
            // 動態添加樣式
            return arg.date.toISOString().split("T")[0] === selectedDate
              ? "custom-selected-day"
              : "";
          }}
          datesSet={(info) => {
            setCurrentMonth(info.view.calendar.getDate().getMonth() + 1);
            setQueryParams({
              startTime: info.startStr.split("+")[0],
              endTime: info.endStr.split("+")[0],
            });
          }}
          headerToolbar={{
            left: "prev,customToday,next",
            center: "title",
            right: "",
          }}
          dayMaxEvents={2}
          contentHeight={300}
          height={"100%"}
          selectable={true}
          stickyHeaderDates={true}
        /> */}
      </div>
      <DashRecord />
    </div>
  );
}

export default Dash;
