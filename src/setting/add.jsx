import React, { useRef } from "react";
import { useState, useEffect } from "react";
import "./add.css";
import { url } from "../service";
function Add({ onClick, firsource }) {
  const [categories, setCategories] = useState([]);
  const [source, setSource] = useState(firsource);
  const [acccount, setAccount] = useState([]);
  const [isactive, setActive] = useState(true);
  const [user, setUser] = useState(localStorage.getItem("user"));
  const dateInputRef = useRef(null);
  const getCategories = (source) => {
    setSource(source);
    if (source === "in") {
      setActive(true);
    } else {
      setActive(false);
    }
  };
  useEffect(() => {
    getCategories(source);
  });
  useEffect(() => {
    let date = new Date();
    var day = date.getDate() < 10 ? `0${date.getDate() + 1}` : date.getDate();
    var month =
      date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

    let datew = date.getFullYear() + "-" + month + "-" + day;
    console.log(datew);
    dateInputRef.current.value = datew;
  }, []);
  const getadd = () => {
    let price = document.getElementById("money").value;
    let type = document.getElementById("categories-type").value;
    let mtype = document.getElementById("Finances-type").value;
    let time = document.getElementById("time").value;
    onClick(price, type, mtype, time, source);
  };

  const close = () => {
    let popup = document.getElementsByClassName("Finances-popbox");
    let addbtn = document.getElementsByClassName("plus");

    popup[0].style.display = "none";
    addbtn[0].style.display = "inline-block";
  };
  useEffect(() => {
    var cateURl = `${url}/account_api/categories.php?user=${user}&source=${source}`;
    var accountURl = `${url}/account_api/accountType.php?user=${user}`;
    fetch(cateURl)
      .then((res) => res.json())
      .then((data) => {
        var datas = [];
        for (let i = 0; i < data.length; i++) {
          datas.push({
            type: data[i].type,
          });
        }
        setCategories(datas);
      })
      .catch((err) => {
        console.error(err);
      });
    fetch(accountURl)
      .then((res) => res.json())
      .then((data) => {
        var datas = [];
        for (let i = 0; i < data.length; i++) {
          datas.push({
            type: data[i].type,
          });
        }
        setAccount(datas);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [source]);

  return (
    <div className="Finances-popbox">
      <div className="popbox-btn">
        <button
          className={isactive ? "pop-active" : "in"}
          onClick={() => {
            getCategories("in");
          }}
        >
          收入
        </button>
        <button
          className={isactive ? "out" : "pop-active"}
          onClick={() => {
            getCategories("out");
          }}
        >
          支出
        </button>
      </div>

      <div className="Finances-put">
        <input
          type="date"
          id="time"
          placeholder="mm/dd/yyyy"
          ref={dateInputRef}
        />
      </div>
      <div className="Finances-put">
        <p>金額</p>
        <input type="text" placeholder="輸入金額" id="money" />
      </div>
      <div className="Finances-put">
        <p>帳戶類</p>
        <select name="" id="Finances-type">
          <option value="" selected hidden>
            --帳戶類--
          </option>
          {acccount.map((datas) => (
            <option value={datas.type}>{datas.type}</option>
          ))}
        </select>
      </div>
      <div className="Finances-put">
        <p>類別</p>
        <select name="" id="categories-type">
          <option value="" selected hidden>
            --類別--
          </option>
          {categories.map((data) => (
            <option value={data.type}>{data.type}</option>
          ))}
        </select>
      </div>
      <div className="pop-btn">
        <button onClick={close}>取消</button>
        <button onClick={getadd}>確認</button>
      </div>
    </div>
  );
}

export default Add;
