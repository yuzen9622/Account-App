import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/accountContext";
import { UserContext } from "../context/userContext";
import { url } from "../service";
import AddCardIcon from "@mui/icons-material/AddCard";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { AccountPopbox } from "../components/TypeEdit";
export default function AccountType() {
  const { token, setMessage } = useContext(UserContext);
  const [newAccount, setNewAccount] = useState(null);

  const { accounts, setAccounts } = useContext(AccountContext);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const del = async (_id) => {
    try {
      const res = await fetch(`${url}/accounts/delete/${_id}`, {
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAccounts((prev) => {
          let newPrev = prev?.filter((item) => item._id !== _id);
          return newPrev;
        });

        setMessage({ status: "success", text: "刪除成功", open: true });
      } else {
        setMessage({ status: "warning", text: "刪除失敗", open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  };
  const edit = (info) => {
    setNewAccount(info);
    setIsEdit(true);
  };

  const open = () => {
    setNewAccount(null);
    setIsEdit(true);
  };

  return (
    <div className="Fixed-Finances ">
      <div className="top">
        <button onClick={() => navigate("/setting")}>
          <ChevronLeftRoundedIcon style={{ fontSize: "28px" }} />
        </button>
        <h3>帳戶</h3>
        <button onClick={open}>
          <AddCardIcon />
        </button>
      </div>

      <div className="Finances">
        <>
          <div className="caregories">
            {accounts?.map((datas) => {
              return (
                <div className="care-type" key={datas._id}>
                  <h3>{datas.accountsType}</h3>
                  <p>初始:${datas.initialAmount}</p>
                  <div className="btn">
                    <button onClick={() => edit(datas)}>
                      <BorderColorRoundedIcon style={{ fontSize: "20px" }} />
                    </button>
                    <button
                      onClick={() => {
                        del(datas._id);
                      }}
                    >
                      <DeleteForeverRoundedIcon style={{ fontSize: "20px" }} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="care-type">
              <h3>新增</h3>
              <button onClick={open}>
                <AddCardIcon />
              </button>
            </div>
          </div>
        </>
        {isEdit && (
          <AccountPopbox
            editInfo={newAccount}
            onclose={() => setIsEdit(false)}
          />
        )}
      </div>
    </div>
  );
}
