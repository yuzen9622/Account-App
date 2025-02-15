import React, { useCallback, useContext, useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { AccountContext } from "../context/accountContext";
import DateRecord from "../components/dateRecord";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import "./chart.css";
import "../account/sett.css";
import { BarChart } from "@mui/x-charts";
import DateSelect from "../components/DateSelect";
import AnimatedNumber from "../components/AnimatedTag";
import FormatNumber from "../components/FormatNumber";

function Chart() {
  const { accounts, categories, filterRecords } = useContext(AccountContext);
  const [chartData, setChartData] = useState(null);

  const [sort, setSort] = useState(true);
  const [chartType, setChartType] = useState("pie");
  const [type, setType] = useState({
    type: "account",
    source: "expense",
  });
  const [dateRecord, setDateRecord] = useState(null);

  const filterRecordDate = (_id) => {
    const groupedByDate = filterRecords?.reduce((result, item) => {
      const { date, amount, source, accountId, categoryId } = item;
      let numberAmount = parseFloat(amount);
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
          record.total += numberAmount;
        } else {
          record.total -= numberAmount;
        }
      }

      return result;
    }, []);
    groupedByDate.sort((a, b) => new Date(b.date) - new Date(a.date));
    setDateRecord(groupedByDate);
  };
  const filterRecord = useCallback(() => {
    let grouped = filterRecords?.reduce((result, item) => {
      const { accountId, amount, source, categoryId } = item;
      let record;
      let numberAmount = parseFloat(amount);
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
        record.value += numberAmount;
        record.total += numberAmount;
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
        record.value += numberAmount;
        record.total += numberAmount;
      }

      return result;
    }, []);
    const total = grouped?.reduce((sum, entry) => sum + entry.value, 0);
    grouped = grouped.map((entry) => ({
      ...entry,
      value: parseFloat(((entry.value / total) * 100).toFixed(1)),
    }));
    grouped.sort((a, b) => b.total - a.total);
    setChartData(grouped);
  }, [filterRecords, accounts, categories, type]);

  useEffect(() => {
    if (sort) {
      setChartData((prev) => {
        return prev?.toSorted((a, b) => b.total - a.total);
      });
    } else {
      setChartData((prev) => {
        return prev?.toSorted((a, b) => a.total - b.total);
      });
    }
  }, [sort]);

  useEffect(() => {
    if (!filterRecords || !accounts || !categories) return;
    setChartData([]);
    setDateRecord(null);

    filterRecord();
  }, [filterRecords, accounts, type, categories, filterRecord]);

  return (
    <div className="chart">
      <Helmet>
        <title>圖表分析</title>
      </Helmet>
      <h1>圖表分析</h1>
      <div className="chart-container">
        <DateSelect />
        <div className="select-type">
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

          <button onClick={() => setSort((prev) => !prev)}>
            <SwapVertRoundedIcon color="inherit" />
          </button>

          {chartType === "pie" ? (
            <button onClick={() => setChartType("bar")}>
              <BarChartRoundedIcon color="inherit" />
            </button>
          ) : (
            <button onClick={() => setChartType("pie")}>
              <PieChartRoundedIcon color="inherit" />
            </button>
          )}
        </div>

        {chartData && chartType === "pie" && (
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
        {chartData && chartType === "bar" && (
          <BarChart
            dataset={chartData}
            series={[
              {
                dataKey: "value",
                label: () => {
                  chartData?.map((item) => {
                    return item.label;
                  });
                },

                highlightScope: { fade: "global", highlight: "item" },
                valueFormatter: (item) => {
                  return `${item}%`;
                },
              },
            ]}
            xAxis={[{ scaleType: "band", dataKey: "label" }]}
            yAxis={[
              {
                valueFormatter: (value) => `${value.toFixed(1)}%`, // Y 軸顯示百分比
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
            borderRadius={5}
            height={200}
          />
        )}
      </div>
      {chartData && chartData.length > 0 && (
        <div className="display-list">
          <h3>
            合計:
            <AnimatedNumber
              number={chartData?.reduce((a, b) => {
                return a + b.total;
              }, 0)}
            />
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
                  <tr key={key} onClick={() => filterRecordDate(item.id)}>
                    <td>{key + 1}</td>
                    <td>{item.label}</td>
                    <td>
                      <FormatNumber number={item.total} />
                    </td>
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
