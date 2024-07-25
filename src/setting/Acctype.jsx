import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import "./change.css";
import "./add.css";
import { url } from "../service";
function Accounttype() {
  const [user, setUser] = useState(localStorage.getItem("user"));

  const [counter1, setCounter1] = useState([]);
  var cateURl = `${url}/account_api/accountType.php?user=${user}`;

  const navigete = useNavigate();

  const open = () => {
    let popbox = document.getElementsByClassName("add-Acc")[0];
    popbox.style.display = "flex";
  };

  const close = () => {
    let popbox = document.getElementsByClassName("add-Acc")[0];
    popbox.style.display = "none";
  };

  function addAcc() {
    var input_1 = document.getElementById("add-acc").value;
    if (input_1 !== "") {
      let newData = [...counter1, { type: input_1 }];

      console.log(newData);
      setCounter1(newData);
      fetch(cateURl, {
        method: "POST",
        body: JSON.stringify({
          type: input_1,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok == true) {
          }
        });
      close();
    }
  }

  const del = (nub, id) => {
    fetch(cateURl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((response) => {
        if ((response.ok = true)) {
          console.log("delete successful");
        }
      })
      .catch((err) => {
        console.error(err);
      });
    const data = [...counter1];
    data.splice(nub, 1);
    setCounter1(data);
  };

  useEffect(() => {
    fetch(cateURl)
      .then((res) => res.json())
      .then((data) => {
        var datas = [];
        for (let i = 0; i < data.length; i++) {
          datas.push({
            id: data[i].id,
            type: data[i].type,
          });
        }

        setCounter1(datas);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [0]);

  return (
    <div className="Fixed-Finances">
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
        {counter1.length == 0 ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div className="caregories">
              {counter1.map((datas, key) => (
                <div className="care-type">
                  <h3>{datas.type}</h3>
                  <button
                    onClick={() => {
                      del(key, datas.id);
                    }}
                  >
                    刪除
                  </button>
                </div>
              ))}
              <div className="care-type">
                <h3>新增</h3>
                <button onClick={open}>
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </>
        )}
        <div className="add-Acc">
          <p>新增類別</p>
          <input type="text" name="" id="add-acc" placeholder="輸入類別名" />
          <div className="add-btn">
            <button onClick={close}>取消</button>
            <button onClick={addAcc}>新增</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounttype;
