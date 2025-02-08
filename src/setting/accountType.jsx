import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/accountContext";
import { UserContext } from "../context/userContext";
import { url } from "../service";
export default function AccountType() {
  const { token, user, setMessage } = useContext(UserContext);
  const [newAccount, setNewAccount] = useState({
    _id: null,
    userId: user._id,
    amount: 0,
    type: "",
  });

  const { accounts, setAccounts } = useContext(AccountContext);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const add = async () => {
    try {
      const res = await fetch(`${url}/accounts/add`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });

      const data = await res.json();

      if (data.ok) {
        setAccounts((prev) => [...prev, data.account]);
        setMessage({ status: "success", text: "新增成功", open: true });

        close();
      } else {
        setMessage({ status: "warning", text: data.error, open: true });
      }
      setNewAccount({ userId: user._id, amount: 0, type: "" });
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  };
  const update = async () => {
    try {
      const res = await fetch(`${url}/accounts/update`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
      const data = await res.json();
      if (data.ok) {
        setAccounts((prev) => {
          let newPrev = prev?.map((item) => {
            if (item._id === newAccount._id) {
              return data.account;
            }
            return item;
          });
          console.log(newPrev);
          return newPrev;
        });
        setMessage({ status: "success", text: "編輯成功", open: true });
        close();
      } else {
        setMessage({ status: "warning", text: data.error, open: true });
      }
    } catch (error) {
      setMessage({ status: "error", text: "編輯失敗", open: true });
      console.log(error);
    }
  };

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
    setNewAccount({
      _id: info._id,
      userId: user._id,
      amount: info.initalAmount,
      type: info.accountsType,
    });
    setIsEdit(true);
  };

  const open = () => {
    let popbox = document.getElementsByClassName("add-Acc")[0];
    popbox.style.display = "flex";
  };
  const close = () => {
    let popbox = document.getElementsByClassName("add-Acc")[0];
    popbox.style.display = "none";
    setIsEdit(false);
  };
  return (
    <div className="Fixed-Finances ">
      <div className="top">
        <button onClick={() => navigate("/setting")}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <h3>帳戶</h3>
        <button onClick={open}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="Finances">
        <>
          <div className="caregories">
            {accounts?.map((datas, key) => {
              return (
                <div className="care-type" key={key}>
                  <h3>{datas.accountsType}</h3>
                  <p>初始:${datas.initalAmount}</p>
                  <div className="btn">
                    <button onClick={() => edit(datas)}>
                      <i className="fa-solid fa-pen-nib"></i>
                    </button>
                    <button
                      onClick={() => {
                        del(datas._id);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="care-type">
              <h3>新增</h3>
              <button onClick={open}>
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </>
        {isEdit && (
          <div className="update-Acc">
            <p>編輯帳戶</p>
            <label htmlFor="number">初始餘額</label>
            <input
              type="number"
              id="number"
              inputMode="numeric"
              placeholder={"初始餘額"}
              value={newAccount.amount}
              onChange={(e) =>
                setNewAccount((prev) => ({ ...prev, amount: e.target.value }))
              }
            />
            <input
              type="text"
              name=""
              id="add-acc"
              value={newAccount.type}
              onChange={(e) =>
                setNewAccount((prev) => ({ ...prev, type: e.target.value }))
              }
              placeholder={`編輯帳戶`}
            />
            <div className="add-btn">
              <button onClick={close}>取消</button>
              <button onClick={update}>新增</button>
            </div>
          </div>
        )}

        <div className="add-Acc">
          <p>新增帳戶</p>
          <label htmlFor="number">初始餘額</label>
          <input
            type="number"
            id="number"
            placeholder="初始餘額"
            value={newAccount.amount}
            onChange={(e) =>
              setNewAccount((prev) => ({ ...prev, amount: e.target.value }))
            }
          />
          <input
            type="text"
            name=""
            id="add-acc"
            onChange={(e) =>
              setNewAccount((prev) => ({ ...prev, type: e.target.value }))
            }
            value={newAccount.type}
            placeholder={`新增帳戶`}
          />
          <div className="add-btn">
            <button onClick={close}>取消</button>
            <button onClick={add}>新增</button>
          </div>
        </div>
      </div>
    </div>
  );
}
