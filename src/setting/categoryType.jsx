import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./change.css";
import { url } from "../service";
import { CategroyPopbox } from "../components/TypeEdit";
import { AccountContext } from "../context/accountContext";
import { UserContext } from "../context/userContext";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
function CategoryType() {
  const { categories, setCategories } = useContext(AccountContext);
  const { token, setMessage } = useContext(UserContext);
  const [source, setSource] = useState("expense");
  const [newCategory, setNewCategory] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState(null);

  const navigete = useNavigate();
  useEffect(() => {
    const filtercategories = categories?.filter(
      (category) => category.source === source
    );

    setType(filtercategories);
  }, [categories, source]);

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
      } else {
        setMessage({ status: "error", text: "刪除失敗", open: true });
      }
    } catch (error) {
      console.log(error);
      setMessage({ status: "error", text: "伺服器錯誤", open: true });
    }
  };

  const edit = async (data) => {
    setNewCategory(data);
    setIsEdit(true);
  };

  const open = () => {
    setNewCategory(null);
    setIsEdit(true);
  };

  return (
    <div className="Fixed-Finances ">
      <div className="top">
        <button onClick={() => navigete("/setting")}>
          <ChevronLeftRoundedIcon style={{ fontSize: "28px" }} />
        </button>
        <h3>類別</h3>
        <button onClick={open}>
          <AddRoundedIcon style={{ fontSize: "28px" }} />
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
                <AddRoundedIcon style={{ fontSize: "28px" }} />
              </button>
            </div>
          </div>
        </>
        {isEdit && (
          <CategroyPopbox
            editInfo={newCategory}
            onclose={() => setIsEdit(false)}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryType;
