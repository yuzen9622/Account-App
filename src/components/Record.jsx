import React, { useContext } from "react";
import { AccountContext } from "../context/accountContext";
import moment from "moment";
import { url } from "../service";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import "moment/locale/zh-tw";
import { UserContext } from "../context/userContext";
import FormatNumber from "./FormatNumber";
moment.locale("zh-tw");
export default function Record({ record, edit = true, _id }) {
  const { accounts, categories, setRecords, setUpdateRecordInfo, setPopOpen } =
    useContext(AccountContext);
  const { token, setMessage } = useContext(UserContext);
  const account = accounts?.find((item) => item._id === record.accountId);
  const toAccount = accounts?.find((item) => item._id === record.toAccountId);
  const category = categories?.find((item) => item._id === record.categoryId);
  const handleDelete = async (_id) => {
    try {
      if (!_id) return;
      let iscancel = window.confirm("確定刪除?");
      if (!iscancel) return;
      const res = await fetch(`${url}/records/delete/${_id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setRecords((prev) => {
          let newPrev = prev?.filter((item) => item._id !== _id);
          return newPrev;
        });
        setMessage({
          status: "success",
          text: "刪除成功",
          open: true,
        });
      } else {
        setMessage({
          status: "warning",
          text: "刪除失敗",
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="record-list">
      {account && category && (
        <>
          <div className="category">
            <p>{category.categoriesType}</p>
            <div className="description">
              {record.description && <p>{record.description}</p>}
              {record.toAccountId && (
                <p>
                  {record.toAccountId && record.toAccountId !== _id && "轉入"}
                  {record.toAccountId && record.toAccountId === _id && "轉出至"}
                  {record.toAccountId &&
                    record.toAccountId !== _id &&
                    toAccount?.accountsType}
                  {record.toAccountId &&
                    record.toAccountId === _id &&
                    account?.accountsType}
                </p>
              )}
            </div>
          </div>

          <div className="amount-display">
            <div className="amount">
              <p
                style={
                  record.source === "income"
                    ? { backgroundColor: "var(--income-color)", color: "#fff" }
                    : record.source === "expense"
                    ? { color: "var(--expense-color)" }
                    : { backgroundColor: "var(--change-color)", color: "#fff" }
                }
              >
                {record.source === "expense" && record.amount !== 0 && "-"}

                <FormatNumber number={record.amount} />
              </p>
              <p className="description">
                {record.toAccountId && record.toAccountId === _id && "轉入"}
                {record.toAccountId && record.toAccountId !== _id && "轉出"}
                {!record.toAccountId && account?.accountsType}
              </p>
            </div>
            {edit && (
              <div className="record-setting">
                <button
                  onClick={() => {
                    setUpdateRecordInfo(record);
                    setPopOpen(true);
                  }}
                >
                  <BorderColorRoundedIcon fontSize="inherit" />
                </button>
                <button onClick={() => handleDelete(record._id)}>
                  <DeleteForeverRoundedIcon fontSize="inherit" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
