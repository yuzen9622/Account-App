import React, { useEffect, useState } from 'react'
import PieChart from '../pie';
import './total.css'

function Total() {

    const [islogin, setlogin] = useState(false)
    const [user, setuser] = useState(sessionStorage.getItem("user"))
    const [select, setSelect] = useState("mtype")
    const [total, setTotal] = useState()
    const [inData, setinData] = useState({
        labels: [],
        datasets: [],
    })
    const [outData, setoutData] = useState({
        labels: [],
        datasets: [],
    })
    function selecttype() {
        var setval = document.getElementById('select').value;
        setSelect(setval)
    }

    useEffect(() => {

        var inURL = `http://localhost/account_api/getId.php?name=${user}&selects=${select}`;
        var outURL = `http://localhost/account_api/getId_out.php?name=${user}&selects=${select}`
        let outall = 0;
        let inall = 0;
        fetch(inURL)
            .then((res) => res.json())
            .then((datas) => {
                var data = [];
                ;
                for (let i = 0; i < datas.response.length; i++) {
                    data.push({
                        type: datas.response[i].mtype, price: parseInt(datas.response[i].price)

                    })
                    inall += parseInt(datas.response[i].price);

                }
                setinData({
                    labels: data.map((datas) => datas.type),
                    datasets: [{
                        label: "$",
                        data: data.map((datas) => datas.price),
                        backgroundColor: ["#ff6464", "#ff8264", "#ffaa64", "#fffa5"]
                    }]
                })
            })
            .catch((err) => {
                console.error(err);
            });

        fetch(outURL)
            .then((res) => res.json())
            .then((datas) => {
                var data = [];

                for (let i = 0; i < datas.response.length; i++) {
                    data.push({
                        type: datas.response[i].mtype, price: parseInt(datas.response[i].price)

                    })
                    outall += parseInt(datas.response[i].price);
                }
                setoutData({
                    labels: data.map((datas) => datas.type),
                    datasets: [{
                        label: "$",
                        data: data.map((datas) => datas.price),
                        backgroundColor: ["#57c1c7", "#c9b95e", "#7dd4b1", "#2f7f8e"]
                    }]
                })
            })
            .catch((err) => {
                console.error(err);
            })
        setTotal(inall - outall)
    }, [select])

    return (<>
        <div className="titel">
            <h1>總計</h1>
            <hr />
        </div>
        <select name="" id="select" onChange={selecttype}>
            <option value="mtype">依帳戶</option>
            <option value="type">依類別</option>

        </select>
        <div className="canvans">
            <div className="total-can">
                <h3>收入</h3>
                <PieChart datas={inData} />
            </div>
            <div className="total-can">
                <h3>支出</h3>
                <PieChart datas={outData} />
            </div>

        </div>


    </>)

}

export default Total;   
