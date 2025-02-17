import React, { useCallback, useContext, useEffect, useState } from "react";
import "./export.css";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { AccountContext } from "../context/accountContext";
import DateSelect from "../components/DateSelect";
import moment from "moment";

export default function DataExport() {
  const navigate = useNavigate();

  const { filterRecords, accounts, categories } = useContext(AccountContext);
  const [excelData, setExcelData] = useState([]);

  const recordToExcel = useCallback(() => {
    if (!filterRecords || !accounts || !categories) return;
    const formatRecord = filterRecords.reduce((result, item) => {
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
        類別: category?.categoriesType || description,
        金額: amount,
        收支: formatSource,
        帳戶: account.accountsType,
        轉帳帳戶: toAccount?.accountsType || null,
        備註: category?.categoriesType ? description : null,
      });

      return result;
    }, []);
    formatRecord.sort((a, b) => new Date(b.日期) - new Date(a.日期));
    setExcelData(formatRecord);
  }, [filterRecords, accounts, categories]);

  useEffect(() => {
    if (!filterRecords) return;
    recordToExcel();
  }, [filterRecords, recordToExcel]);

  const ExcelPreview = ({ data }) => {
    if (!data || data.length === 0) return null;
    const headers = Object.keys(data[0]);

    return (
      <table cellPadding="5" cellSpacing="0">
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

  return (
    <div className="export">
      <div className="top">
        <button onClick={() => navigate("/setting")}>
          <ChevronLeftRoundedIcon style={{ fontSize: "28px" }} />
        </button>
        <h3>資料匯出</h3>
        <CSVLink
          filename={moment().format("YYYY-MM-DD") + "_計帳紀錄"}
          data={excelData}
        >
          <DownloadIcon />
        </CSVLink>
      </div>
      <DateSelect />
      <h1>預覽</h1>
      <div className="export-preview">
        <ExcelPreview data={excelData} />
      </div>

      <CSVLink
        filename={moment().format("YYYY-MM-DD") + "_計帳紀錄"}
        data={excelData}
        className="button"
      >
        下載CSV檔案
        <DownloadIcon />
      </CSVLink>
    </div>
  );
}
