import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./change.css";
import "./add.css";
import { url } from "../service";
import { AccountContext } from "../context/accountContext";
import { UserContext } from "../context/userContext";
function Finances() {
  const { categories, setCategories, setMessage } = useContext(AccountContext);
  const { token, user } = useContext(UserContext);
  const [source, setSource] = useState("expense");
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);

  const navigete = useNavigate();
  useEffect(() => {
    const filtercategories = categories?.filter(
      (category) => category.source === source
    );

    setType(filtercategories);
  }, [categories, source]);
  async function add() {
    try {
      const res = await fetch(`${url}/categories/add`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, type: category, source }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data.category]);
        setMessage({ status: "success", text: "新增成功", open: true });
        close();
      }
    } catch (error) {}
  }

  const del = async (_id) => {
    try {
      const res = await fetch(`${url}/categories/delete/${_id}`, {
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories((prev) => {
          let newPrev = prev?.map((item) => {
            if (item._id === _id) {
              return { ...item, isDeleted: true };
            }
            return item;
          });
          return newPrev;
        });
        setMessage({ status: "success", text: "刪除成功", open: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const open = () => {
    let popbox = document.getElementsByClassName("add-Acc")[0];
    popbox.style.display = "flex";
  };

  const close = () => {
    let popbox = document.getElementsByClassName("add-Acc")[0];
    popbox.style.display = "none";
  };

  return (
    <div className="Fixed-Finances ">
      <div className="top">
        <button onClick={() => navigete("/setting")}>
          <i class="fa-solid fa-angle-left"></i>
        </button>
        <h3>類別</h3>
        <button onClick={open}>
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="Finances">
        <div className="popbox-btn">
          <button
            onClick={() => setSource("expense")}
            className={source === "expense" ? "pop-active" : "out"}
          >
            支出
          </button>
          <button
            onClick={() => setSource("income")}
            className={source === "income" ? "pop-active" : "in"}
          >
            收入
          </button>
          <button
            onClick={() => setSource((prev) => "change")}
            className={source === "change" ? "pop-active" : "in"}
          >
            轉帳
          </button>
        </div>

        <>
          <div className="caregories">
            {type?.map((datas, key) => {
              if (datas.isDeleted) return null;

              return (
                <div className="care-type" key={key}>
                  <h3>{datas.categoriesType}</h3>

                  <button
                    onClick={() => {
                      del(datas._id);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              );
            })}
            <div className="care-type">
              <h3>新增</h3>
              <button onClick={open}>
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </>

        <div className="add-Acc">
          <p>
            新增
            {source === "expense"
              ? "支出"
              : source === "income"
              ? "收入"
              : "轉帳"}
            類別
          </p>
          <input
            type="text"
            name=""
            id="add-acc"
            onChange={(e) => setCategory(e.target.value)}
            placeholder={`新增${
              source === "expense"
                ? "支出"
                : source === "income"
                ? "收入"
                : "轉帳"
            }類別`}
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

export default Finances;
