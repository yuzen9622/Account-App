import React, { useContext, useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { AccountContext } from "../context/accountContext";
import { UserContext } from "../context/userContext";
import { url } from "../service";
export function AccountPopbox({ onclose, editInfo }) {
  const { accounts, setAccounts } = useContext(AccountContext);
  const { user, token, setMessage } = useContext(UserContext);
  const [newAccount, setNewAccount] = useState({
    _id: null,
    userId: user._id,
    initialAmount: 0,
    accountsType: "",
    toAccountId: "",
    autoDebit: false,
    autoDebitDay: "",
  });
  useEffect(() => {
    if (editInfo) {
      setNewAccount(editInfo);
    } else {
      setNewAccount({
        _id: null,
        userId: user._id,
        initialAmount: 0,
        accountsType: "",
        toAccountId: "",
        autoDebit: false,
        autoDebitDay: "",
      });
    }
  }, [editInfo, user._id]);
  const handleSubmit = async () => {
    if (newAccount._id) {
      await updateAccount();
    } else {
      await addAccount();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const addAccount = async () => {
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
        onclose();
      } else {
        setMessage({ status: "warning", text: data.error, open: true });
      }
      setNewAccount({
        _id: null,
        userId: user._id,
        initialAmount: 0,
        accountsType: "",
        toAccountId: "",
        autoDebit: false,
        autoDebitDay: "",
      });
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  };
  const updateAccount = async () => {
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
        onclose();
      } else {
        setMessage({ status: "warning", text: data.error, open: true });
      }
    } catch (error) {
      setMessage({ status: "error", text: "編輯失敗", open: true });
      console.log(error);
    }
  };
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="popbox">
      <div className="account-pop"></div>
      <p>{newAccount._id ? "編輯帳戶" : "新增帳戶"}</p>
      <div className="Finances-put">
        <p>帳戶</p>
        <input
          type="text"
          onChange={(e) => handleChange(e)}
          placeholder="帳戶名"
          name="accountsType"
          value={newAccount.accountsType}
        />
      </div>
      <div className="Finances-put">
        <p>初始餘額</p>
        <input
          type="number"
          name="initialAmount"
          placeholder="$金額"
          inputMode="numeric"
          onChange={(e) => handleChange(e)}
          value={newAccount.initialAmount}
        />
      </div>
      {/* <div className="Finances-put">
        <p>自動扣款</p>
        <Switch
          name="autoDebit"
          checked={newAccount.autoDebit}
          onChange={(e) =>
            setNewAccount((prev) => ({ ...prev, autoDebit: e.target.checked }))
          }
        />
      </div>
      <div className="Finances-put">
        <p>扣款帳戶</p>
        <select
          value={newAccount.toAccountId}
          disabled={!newAccount?.autoDebit}
        >
          <option selected hidden value="">
            --帳戶--
          </option>
          {accounts &&
            accounts.map((item) => (
              <option key={item._id} value={item._id}>
                {item.accountsType}
              </option>
            ))}
        </select>
      </div>
      <div className="Finances-put">
        <p>扣款日期</p>
        <select disabled={!newAccount?.autoDebit}>
          <option value="">選擇日</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div> */}
      <div className="pop-btn">
        <button
          onClick={() => {
            onclose();
          }}
        >
          取消
        </button>
        <button
          onClick={() => {
            handleSubmit();
          }}
        >
          確認
        </button>
      </div>
    </div>
  );
}
export function CategroyPopbox({ onclose, editInfo }) {
  const { setCategories } = useContext(AccountContext);
  const { token, user, setMessage } = useContext(UserContext);
  const [newCategory, setNewCategory] = useState({
    _id: null,
    userId: user._id,
    categoriesType: "",
    source: "",
  });
  useEffect(() => {
    if (editInfo) {
      setNewCategory(editInfo);
    } else {
      setNewCategory({
        _id: null,
        userId: user._id,
        categoriesType: "",
        source: "",
      });
    }
  }, [editInfo, user]);
  const handleSubmit = async () => {
    if (newCategory._id) {
      await updateCategory();
    } else {
      await addCategory();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const updateCategory = async () => {
    try {
      const res = await fetch(`${url}/categories/update`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      if (data.ok) {
        setCategories((prev) => {
          let newPrev = prev?.find((item) => item._id === newCategory._id);
          newPrev.categoriesType = data.category.categoriesType;
          return prev;
        });
        onclose();
        setMessage({ status: "success", text: "修改成功", open: true });
      } else {
        setMessage({ status: "warning", text: "修改失敗", open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  };
  async function addCategory() {
    try {
      const res = await fetch(`${url}/categories/add`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      if (data.ok) {
        setCategories((prev) => [...prev, data.category]);
        setMessage({ status: "success", text: "新增成功", open: true });
        onclose();
      } else {
        setMessage({ status: "warning", text: data.error, open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  }
  return (
    <div className="popbox">
      <div className="account-pop"></div>
      <p>{newCategory._id ? "編輯類別" : "新增類別"}</p>
      <div className="Finances-put">
        <p>類別</p>
        <input
          type="text"
          onChange={(e) => handleChange(e)}
          placeholder="輸入類別"
          name="categoriesType"
          value={newCategory.categoriesType}
        />
      </div>
      <div className="Finances-put">
        <p>收支轉</p>
        <select
          name="source"
          value={newCategory.source}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, source: e.target.value }))
          }
        >
          <option value="" hidden>
            --收支轉--
          </option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
          <option value="change">轉帳</option>
        </select>
      </div>

      <div className="pop-btn">
        <button
          onClick={() => {
            onclose();
          }}
        >
          取消
        </button>
        <button
          onClick={() => {
            handleSubmit();
          }}
        >
          確認
        </button>
      </div>
    </div>
  );
}
