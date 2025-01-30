import React, { useContext, useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { AccountContext } from "../context/accountContext";
import Datetime from "react-datetime";
import DateRecord from "../account/dateRecord";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import "./chart.css";
import "../account/sett.css";
function Chart() {
  const {
    records,
    accounts,
    categories,
    clearQuery,
    setQueryParams,
    getRecord,
  } = useContext(AccountContext);
  const [chartData, setChartData] = useState(null);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
  const [end, setEnd] = useState(moment().add(1, "days").format("YYYY-MM-DD"));
  const [selectedType, setSelectedType] = useState("all");
  const [type, setType] = useState({
    type: "account",
    source: "expense",
  });
  const [dateRecord, setDateRecord] = useState(null);
  const fliterRecordDate = (_id) => {
    const groupedByDate = records?.reduce((result, item) => {
      const { date, amount, source, accountId, categoryId } = item;
      if ((accountId === _id || categoryId === _id) && source === type.source) {
        if (
          !result.find(
            (record) => record.date === moment(date).format("YYYY-MM-DD")
          )
        ) {
          result.push({
            date: moment(date).format("YYYY-MM-DD"),
            records: [],
            total: 0,
          });
        }
        let record = result.find(
          (record) => record.date === moment(date).format("YYYY-MM-DD")
        );
        record.records.push(item);
        if (source === "income") {
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
  const fliterRecord = () => {
    let grouped = records?.reduce((result, item) => {
      const { accountId, amount, source, categoryId } = item;
      let record;
      if (type.type === "account" && source === type.source) {
        const account = accounts.find((account) => account._id === accountId);

        if (!result?.find((item) => item.id === accountId)) {
          result?.push({
            id: accountId,
            value: 0,
            label: account.accountsType,
            total: 0,
          });
        }
        record = result.find((item) => item.id === accountId);
        record.value += amount;
        record.total += amount;
      } else if (type.type === "category" && source === type.source) {
        const category = categories?.find(
          (category) => category._id === categoryId
        );
        if (!result?.find((item) => item.id === categoryId)) {
          result?.push({
            id: categoryId,
            value: 0,
            label: category.categoriesType,
            total: 0,
          });
        }
        record = result.find((item) => item.id === categoryId);
        record.value += amount;
        record.total += amount;
      }

      return result;
    }, []);
    const total = grouped?.reduce((sum, entry) => sum + entry.value, 0);
    grouped = grouped.map((entry) => ({
      ...entry,
      value: `${((entry.value / total) * 100).toFixed(1)}`,
    }));

    grouped.sort((a, b) => b.total - a.total);

    setChartData(grouped);
  };

  useEffect(() => {
    if (!records || !accounts || !categories) return;
    setChartData([]);
    setDateRecord(null);

    fliterRecord();
  }, [records, accounts, type, categories]);

  useEffect(() => {
    setDateRecord(null);
    switch (selectedType) {
      case "all":
        clearQuery(); // 清空所有查詢條件，查詢全部
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
    <div className="chart">
      <Helmet>
        <title>圖表分析</title>
      </Helmet>
      <h1>圖表分析</h1>
      <div className="chart-container">
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
              dateFormat="YYYY-MM"
              value={`${year}-${month}`}
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
                  return current.isBefore(new Date(start));
                }}
                onChange={(e) => setStart(e.format("YYYY-MM-DD"))}
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
                onChange={(e) => setEnd(e.format("YYYY-MM-DD"))}
                inputProps={{ placeholder: "結束日期", readOnly: true }}
              />
            </>
          )}
        </div>
        <div className="selcet-type">
          <select
            name=""
            id=""
            onChange={(e) =>
              setType((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="account">依帳戶</option>
            <option value="category">依類別</option>
          </select>

          <select
            name=""
            id=""
            onChange={(e) =>
              setType((prev) => ({ ...prev, source: e.target.value }))
            }
          >
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
        </div>

        {chartData && (
          <PieChart
            series={[
              {
                valueFormatter: (item) => {
                  return `${item.value}%`;
                },
                arcLabel: (item) => `${item.value}%`,
                arcLabelMinAngle: 35,
                highlightScope: { fade: "global", highlight: "item" },

                data: chartData,
                innerRadius: 50,
                outerRadius: 100,
                paddingAngle: 3,
                cornerRadius: 2,
                startAngle: 0,
                endAngle: 360,
              },
            ]}
            title={`依${type.source === "income" ? "收入" : "支出"}${
              type.type === "account" ? "帳戶" : "類別"
            }比`}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: "bold",
                fontFamily: "arial",
                fill: "white",
              },
            }}
            height={200}
          />
        )}
      </div>
      {chartData && chartData.length > 0 && (
        <div className="display-list">
          <h3>
            合計:
            {chartData?.reduce((a, b) => {
              return a + b.total;
            }, 0)}
          </h3>
          <table>
            <thead>
              <tr>
                <td>#</td>
                <td>{type.type === "account" ? "帳戶" : "類別"}</td>
                <td>金額</td>
                <td>比例</td>
              </tr>
            </thead>
            <tbody>
              {chartData &&
                chartData.map((item, key) => (
                  <tr key={key} onClick={() => fliterRecordDate(item.id)}>
                    <td>{key + 1}</td>
                    <td>{item.label}</td>
                    <td>{item.total}</td>
                    <td>{item.value}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {dateRecord &&
            dateRecord.map((item, key) => (
              <DateRecord key={key} record={item} />
            ))}
        </div>
      )}
    </div>
  );
}

export default Chart;
