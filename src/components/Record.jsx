import React, { useContext, useState } from "react";
import { AccountContext } from "../context/accountContext";
import moment from "moment";
import { url } from "../service";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import "moment/locale/zh-tw";
import { UserContext } from "../context/userContext";
import FormatNumber from "./FormatNumber";
moment.locale("zh-tw");
export default function Record({ record, edit = true, _id }) {
  const { accounts, categories, setRecords, setUpdateRecordInfo, setPopOpen } =
    useContext(AccountContext);
  const { token, setMessage } = useContext(UserContext);
  const [isPending, setIsPending] = useState(false);
  const account = accounts?.find((item) => item._id === record.accountId);
  const toAccount = accounts?.find((item) => item._id === record.toAccountId);
  const category = categories?.find((item) => item._id === record.categoryId);
  const handleDelete = async (_id) => {
    try {
      setIsPending(true);
      if (!_id || isPending) return;
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
    } finally {
      setIsPending(false);
    }
  };
  return (
    account && (
      <div className="record-list">
        <>
          <div className="category">
            <p>{category?.categoriesType || record.description}</p>
            <div className="description">
              <p>
                {record.description &&
                  category?.categoriesType &&
                  record.description}
              </p>
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
                ${record.source === "expense" && record.amount !== 0 && "-"}
                <FormatNumber number={record.amount} />
              </p>
              <p className="description">
                {record.toAccountId && (
                  <>
                    {account.accountsType}
                    <EastRoundedIcon
                      fontSize="inherit"
                      style={{ fontSize: "18px" }}
                    />
                    {toAccount.accountsType}
                  </>
                )}

                {!record.toAccountId && account?.accountsType}
              </p>
            </div>
            {edit && (
              <div className="record-setting">
                <button
                  disabled={isPending}
                  onClick={() => {
                    setUpdateRecordInfo(record);
                    setPopOpen(true);
                  }}
                >
                  <BorderColorRoundedIcon fontSize="inherit" />
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleDelete(record._id)}
                >
                  <DeleteForeverRoundedIcon fontSize="inherit" />
                </button>
              </div>
            )}
          </div>
        </>
      </div>
    )
  );
}
