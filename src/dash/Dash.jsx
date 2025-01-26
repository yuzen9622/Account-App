import React, { useContext, useEffect, useState, useRef } from "react";
import "./Dash.css";
import FullCalendar from "@fullcalendar/react";

import locale from "@fullcalendar/core/locales/zh-tw";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AccountContext } from "../context/accountContext";
import DashRecord from "./DashRecord";
import Add from "../setting/add";
import moment from "moment";
function Dash() {
  const {
    setSelectedDate,
    selectedDate,
    records,
    setCurrentMonth,
    setQueryParams,
  } = useContext(AccountContext);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
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
  const handleTodayClick = () => {
    const calendarApi = calendarRef.current.getApi();
    const today = moment().add(-1, "days").format("YYYY-MM-DD");

    // 設定選定日期並跳到本月
    setSelectedDate(today);
    calendarApi.gotoDate(today); // 跳到當前日期的月份
  };

  return (
    <div className="dash">
      <Add />

      <div className="calendar">
        <FullCalendar
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
            console.log(info.view.calendar.getDate().getMonth() + 1);
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
        />
      </div>
      <DashRecord />
    </div>
  );
}

export default Dash;
