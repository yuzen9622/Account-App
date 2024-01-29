import React from 'react'
import './sett.css'
import { useState, useEffect } from 'react';

function Sett() {
    const [user, setuser] = useState(localStorage.getItem("user"))
    const [inId, setinId] = useState([]);
    const [intype, setIntype] = useState([])
    const [Outtype, setOuttype] = useState([])
    const [source, setsource] = useState("")
    const [intotal, setinTotal] = useState(0);
    const [outtotal, outsetTotal] = useState(0);
    const [type, settype] = useState()
    const [mtype, setmtype] = useState()
    const [error, seterror] = useState("")

    const gettype = (select) => {
        setIntype([])
        setOuttype([])
        let acctip = document.getElementById('account-tip');
        let acctable = document.getElementById('account-table');
        let acctype = document.getElementById('account-type')
        fetch(`https://yuzen.serveirc.com/account_api/getType.php?name=${user}&selects=${select}`)
            .then((res) => res.json())
            .then((data) => {
                var in_datas = [];
                var out_datas = [];

                for (let i = 0; i < data.response.length; i++) {
                    if (data.response[i].source == "in") {
                        in_datas.push({
                            mtype: data.response[i].mtype,
                            price: data.response[i].price
                        })
                    } else if (data.response[i].source == "out") {
                        out_datas.push(
                            {
                                mtype: data.response[i].mtype,
                                price: data.response[i].price
                            }
                        )
                    }

                }
                setIntype(in_datas)
                setOuttype(out_datas)
            })
        settype(select);
        acctip.style.display = 'none';
        acctable.style.display = 'flex';
        acctype.style.display = 'none'
    }

    const getidtype = (select) => {
        setmtype([])
        setIntype([])
        let acctip = document.getElementById('account-tip');
        let acctable = document.getElementById('account-table');
        let acctype = document.getElementById('account-type')
        fetch(`https://yuzen.serveirc.com/account_api/getIDtype.php?name=${user}&selects=${select}&mtype=${type}`)
            .then((res) => res.json())
            .then((data) => {
                var datas = [];
                for (let i = 0; i < data.response.length; i++) {
                    var inputDateStr = data.response[i].time;


                    var inputDate = new Date(inputDateStr);


                    var year = inputDate.getFullYear();
                    var month = inputDate.getMonth() + 1;
                    var day = inputDate.getDate();
                    var formattedDateStr = year + "年" + month + "月" + day + "號";

                    datas.push({
                        source: data.response[i].source,
                        mtype: data.response[i].mtype,
                        price: data.response[i].price,
                        time: formattedDateStr
                    })
                }
                setsource(data.response[0].source)
                setmtype(select)
                setIntype(datas)
            })
        acctip.style.display = 'none';
        acctable.style.display = 'none';
        acctype.style.display = 'flex'
    }

    const closetype = () => {
        let acctip = document.getElementById('account-tip');
        let acctable = document.getElementById('account-table');
        let acctype = document.getElementById('account-type');
        if (acctype.style.display !== 'none') {
            acctable.style.display = 'flex';
            acctip.style.display = 'none';
            acctype.style.display = 'none';
            gettype(type)
        } else if (acctable.style.display !== 'none') {
            acctype.style.display = 'none'
            acctip.style.display = 'block';
            acctable.style.display = 'none'
        }

    }

    useEffect(() => {
        var inid = `https://yuzen.serveirc.com/account_api/getId.php?name=${user}&selects=mtype`
        fetch(inid)
            .then((res) => res.json())
            .then((data) => {
                var datas = [];
                let in_total = 0
                let out_total = 0
                if (data.ok == "true") {
                    for (let i = 0; i < data.response.length; i++) {
                        in_total += parseInt(data.response[i].total_in);
                        out_total += parseInt(data.response[i].total_out)
                        datas.push({
                            mtype: data.response[i].mtype,
                            price: data.response[i].net_price
                        })
                    }
                    outsetTotal(out_total)
                    setinTotal(in_total)
                    setinId(datas)
                    seterror("");
                } else {
                    seterror("無資料")
                }

            })


    }, [0])

    return (
        <div className='usersett'>
            <div className="titel">
                <h1>帳戶</h1>
                <hr />
            </div>
            {error == "" ? <div className="user-sett">

                <div className="total">
                    <div className="all-price">
                        <h1 style={{ color: 'rgb(56, 205, 9)' }}>$ {intotal - outtotal}</h1>
                        <p>淨資產</p>
                    </div>
                    <div className="ac">
                        <div className='box'><h3 style={{ color: 'rgb(56, 205, 9)' }}>{intotal - outtotal}</h3><p>總資產</p></div>
                        <div className='box'><h3 style={{ color: 'rgb(56, 205, 9)' }}>{intotal}</h3><p >收入</p></div>
                        <div className='box'><h3 style={{ color: 'rgb(241, 38, 11)' }}>{outtotal}</h3><p>支出</p></div>
                    </div>
                </div>

                <div className="account-tip" id='account-tip'>
                    <p>帳戶清單</p>
                    {inId.map((datas) => (
                        <div className="account-btn">
                            <button onClick={() => { gettype(`${datas.mtype}`) }}><h4>{datas.mtype}</h4> <p>${datas.price} <i class="fa-solid fa-chevron-right"></i></p></button>
                        </div>
                    ))}
                </div>

                <div className="account-table" id='account-table'>
                    <h2>{type}</h2>
                    {intype.length > 0 ? <><div className="top">
                        <button onClick={closetype}><i class="fa-solid fa-chevron-left"></i></button>
                        <h3>1月份收入類別</h3>
                    </div>
                        {intype.map((data, key) => (
                            <div className="data">
                                <div className="data-inout account-btn" key={key}>
                                    <button onClick={() => { getidtype(`${data.mtype}`) }}><h5>{data.mtype} </h5> <p>{data.price} <i class="fa-solid fa-chevron-right"></i></p></button>
                                </div>
                            </div>
                        ))}
                    </> : <div className="top"><button onClick={closetype}><i class="fa-solid fa-chevron-left"></i></button></div>}
                    {Outtype.length > 0 || intype.length > 0 ? <><div className="top">
                        <h3>1月份支出類別</h3>
                    </div>
                        {Outtype.map((data, key) => (
                            <div className="data">
                                <div className="data-inout account-btn" key={key}>
                                    <button onClick={() => { getidtype(`${data.mtype}`) }}><h5>{data.mtype} </h5> <p>-{data.price} <i class="fa-solid fa-chevron-right"></i></p></button>
                                </div>
                            </div>
                        ))}
                    </> : <h1>Loading...</h1>}
                </div>

                <div id="account-type" className='account-table'>

                    {source == "in" ? <><div className="top">
                        <button onClick={closetype}><i class="fa-solid fa-chevron-left"></i></button>
                        <h3>{mtype}收入類</h3>
                    </div>
                        {intype.length == 0 ? <h1>Loading...</h1> : intype.map((data, key) => (
                            <div className="data">
                                <h4>{data.time}</h4>
                                <div className="data-inout account-btn" key={key}>
                                    <button><h5>{data.mtype} </h5> <p>{data.price} </p></button>
                                </div>
                            </div>
                        ))}</> : <> <div className="top">
                            <button onClick={closetype}><i class="fa-solid fa-chevron-left"></i></button>
                            <h3>{mtype}收入類</h3>
                        </div>
                        {intype == 0 ? <h1>Loading...</h1> : intype.map((data, key) => (
                            <div className="data">
                                <h4>{data.time}</h4>
                                <div className="data-inout account-btn" key={key}>
                                    <button><h5>{data.mtype} </h5> <p>-{data.price} </p></button>
                                </div>
                            </div>
                        ))}</>}


                </div>

            </div> : <h1>{error}</h1>}


        </div>

    )
}

export default Sett
