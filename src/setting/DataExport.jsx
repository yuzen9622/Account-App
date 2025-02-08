import React, { useCallback, useContext, useEffect, useState } from "react";
import "./export.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { AccountContext } from "../context/accountContext";
import Datetime from "react-datetime";
import moment from "moment";
import { UserContext } from "../context/userContext";
export default function DataExport() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
  const [end, setEnd] = useState(moment().add(1, "days").format("YYYY-MM-DD"));
  const {
    records,
    accounts,
    categories,
    setQueryParams,
    getRecord,
    clearQuery,
  } = useContext(AccountContext);
  const { setMessage } = useContext(UserContext);
  const [excelData, setExcelData] = useState(null);

  const recordToExcel = useCallback(() => {
    if (!records || !accounts || !categories) return;
    const formatRecord = records.reduce((result, item) => {
      const {
        accountId,
        categoryId,
        toAccountId,
        source,
        amount,
        date,
        description,
      } = item;
      const account = accounts.find((account) => account._id === accountId);
      const toAccount = accounts.find((account) => account._id === toAccountId);
      const category = categories.find(
        (category) => category._id === categoryId
      );
      const formatDate = moment(date).format("YYYY-MM-DD");
      const formatSource =
        source === "income" ? "收入" : source === "expense" ? "支出" : "轉帳";

      result.push({
        日期: formatDate,
        類別: category.categoriesType,
        金額: amount,
        收支: formatSource,
        帳戶: account.accountsType,
        轉帳帳戶: toAccount?.accountsType || null,
        備註: description,
      });

      return result;
    }, []);
    setExcelData(formatRecord);
    console.log(formatRecord);
  }, [records, accounts, categories]);
  useEffect(() => {
    if (!records) return;
    recordToExcel();
  }, [records, recordToExcel]);

  const exportToExcel = (data, fileName = "data.xlsx") => {
    if (!data) {
      setMessage({ status: "warning", text: "暫無資料", open: true });
      return;
    }
    // 將 JSON 資料轉換為 worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    // 建立一個新的 workbook 並把 worksheet 加入
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 將 workbook 轉換為二進位資料
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 產生 Blob 物件並設定 MIME type 為 Excel
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    fileName = moment().format("YYYY-MM-DD") + "_計帳紀錄";
    // 利用 file-saver 下載檔案
    saveAs(blob, fileName);
    setMessage({ status: "success", text: "下載成功", open: true });
  };

  const ExcelPreview = ({ data }) => {
    if (!data || data.length === 0) return null;
    const headers = Object.keys(data[0]);

    return (
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <td key={cellIndex}>
                  {item[header] !== null ? item[header].toString() : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
    <div className="export">
      <div className="top">
        <button onClick={() => navigate("/setting")}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <h3>資料匯出</h3>
        <button onClick={() => exportToExcel(excelData)}>
          <DownloadIcon style={{ fontSize: "20px" }} />
        </button>
      </div>
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
            inputProps={{ placeholder: "YYYY" }}
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
            inputProps={{ placeholder: "YYYY-MM" }}
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
              onChange={(e) => setStart(e.format("YYYY-MM-DD"))}
              inputProps={{ placeholder: "起始日期" }}
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
              inputProps={{ placeholder: "結束日期" }}
            />
          </>
        )}
      </div>
      <h1>預覽</h1>
      <div className="export-preview">
        <ExcelPreview data={excelData} />
      </div>
      <div className="btn">
        <button onClick={() => exportToExcel(excelData)}>
          下載Excl檔案
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
}
