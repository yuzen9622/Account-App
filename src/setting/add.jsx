import React from 'react'
import { useState, useEffect } from 'react';
import './add.css'
import { useNavigate } from 'react-router-dom';
function Add({ onClick, firsource }) {
    const [categories, setCategories] = useState([]);
    const [source, setSource] = useState(firsource)
    const [acccount, setAccount] = useState([])
    const [isactive, setActive] = useState(true)
    const [user, setUser] = useState(sessionStorage.getItem("user"));

    const getCategories = (source) => {
        setSource(source)
        if (source == "in") {
            setActive(true)
        } else {
            setActive(false)
        }
    }
    useEffect(() => {
        getCategories(source)
    })
    const getadd = () => {
        let price = document.getElementById('money').value;
        let type = document.getElementById('categories-type').value;
        let mtype = document.getElementById('Finances-type').value;
        let time = document.getElementById('time').value;
        onClick(price, type, mtype, time, source);
    }

    const close = () => {
        let popup = document.getElementsByClassName('Finances-popbox');
        let addbtn = document.getElementsByClassName('plus')

        popup[0].style.display = 'none'
        addbtn[0].style.display = 'inline-block'


    }
    useEffect(() => {
        var cateURl = `http://oscar689.atwebpages.com/account_api/categories.php?user=${user}&source=${source}`
        var accountURl = `http://oscar689.atwebpages.com/account_api/accountType.php?user=${user}`;
        fetch(cateURl)
            .then((res) => res.json())
            .then((data) => {
                var datas = [];
                for (let i = 0; i < data.length; i++) {
                    datas.push({
                        type: data[i].type
                    })
                }
                setCategories(datas)
            })
            .catch((err) => {
                console.error(err)
            })
        fetch(accountURl)
            .then((res) => res.json())
            .then((data) => {
                var datas = [];
                for (let i = 0; i < data.length; i++) {
                    datas.push({
                        type: data[i].type
                    })
                }
                setAccount(datas)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [source])

    return (
        <div className="Finances-popbox">
            <div className="popbox-btn">
                <button className={isactive ? 'pop-active' : "in"} onClick={() => { getCategories("in") }}>收入</button><button className={isactive ? "out" : 'pop-active'} onClick={() => { getCategories("out") }}>支出</button>
            </div>

            <div className="Finances-put"><input type="date" id='time' /></div>
            <div className="Finances-put">
                <p>金額</p>
                <input type="text" placeholder='輸入金額' id='money' />
            </div>
            <div className="Finances-put">
                <p>帳戶類</p>
                <select name="" id="Finances-type">
                    <option value="" selected hidden>--帳戶類--</option>
                    {acccount.map((datas) => (
                        <option value={datas.type}>{datas.type}</option>
                    ))}
                </select>
            </div>
            <div className="Finances-put">
                <p>類別</p>
                <select name="" id="categories-type">
                    <option value="" selected hidden>--類別--</option>
                    {categories.map((data) => (
                        <option value={data.type}>{data.type}</option>
                    ))}
                </select>

            </div>
            <div className="pop-btn">
                <button onClick={close} >取消</button>
                <button onClick={getadd}>確認</button>
            </div>
        </div>
    )
}

export default Add
