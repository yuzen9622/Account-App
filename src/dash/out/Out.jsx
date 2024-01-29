import React, { useState, useEffect } from 'react'
import PieChart from '../pie'
import Add from '../../setting/add'
function DashOut() {

    const [user, setuser] = useState(sessionStorage.getItem("user"))
    var postURl = `https://yuzen.serveirc.com/account_api/postData_out.php?name=${user}`
    var geturl = `https://yuzen.serveirc.com/account_api/getDate_out.php?name=${user}`
    var getID = `https://yuzen.serveirc.com/account_api/getId.php?name=${user}&selects=mtype`

    const [date, setdate] = useState([]);
    const [IdDate, setIdDate] = useState([])
    var Userdate = date;
    const [total, settotal] = useState(0);

    const [userDate, setUserdate] = useState({

        labels: [],
        datasets: [],
    })



    const add = () => {
        var isopen = false
        let popup = document.getElementsByClassName('Finances-popbox');
        let addbtn = document.getElementsByClassName('plus')
        if (!isopen) {
            popup[0].style.display = 'flex'
            addbtn[0].style.display = 'none'
            isopen = true
        } else {
            popup[0].style.display = 'none'
            addbtn[0].style.display = 'inline-block'
            isopen = false
        }

    }

    const close = () => {
        let popup = document.getElementsByClassName('Finances-popbox');
        let addbtn = document.getElementsByClassName('plus')

        popup[0].style.display = 'none'
        addbtn[0].style.display = ''


    }

    const getId = () => {
        fetch(getID, {
            method: 'POST',
            body: JSON.stringify({
                name: 'oscar'
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        })
            .then((res) => res.json())
            .then((dates) => {
                var date = []

                for (let i = 0; i < dates.response.length; i++) {
                    date.push({
                        type: dates.response[i].mtype, price: dates.response[i].total_out
                    })
                }

                setIdDate(date)
                setUserdate({
                    labels: date.map((data) => data.type),
                    datasets: [{
                        label: "$",
                        data: date.map((data) => data.price),
                        backgroundColor: ["#57c1c7", "#c9b95e", "#7dd4b1", "#2f7f8e"]
                    }]
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }


    const getadd = (price, type, mtype, time, source) => {

        if (!(price && type && mtype && time) == "" && source == "out") {

            Userdate.push(
                {
                    type: type,
                    userget: parseInt(price),
                    userprice: mtype,
                    time: time
                }
            )

            fetch(postURl, {
                method: 'POST',
                body: JSON.stringify({
                    'type': type,
                    "price": parseInt(price),
                    "mtype": mtype,
                    "time": time
                })
            })
                .then((res) => res.json())
                .then((date) => {
                    console.log("post successful", date);
                    getId()
                })
                .catch((error) => {
                    console.error(error);
                })



            settotal(parseInt(price) + total)
            setdate(Userdate);


            close()

        }
    };

    const del = (nub) => {
        var price = Userdate[nub].userget

        var id = Userdate[nub].id;
        var delURl = `https://yuzen.serveirc.com/account_api/delData_out.php?id=${id}`

        fetch(delURl)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                getId()
            })



        Userdate.splice(nub, 1);

        setdate(date);
        settotal(-price + total)
        opensett(nub)

    };

    let openIndex = -1;
    const opensett = (key) => {
        let sett = document.getElementsByClassName('sett')


        if (openIndex !== -1) {
            // Close the previously open element
            sett[openIndex].style.display = 'none';
        }

        if (openIndex !== key) {
            // Open the clicked element if it's not already open
            sett[key].style.display = 'flex';
            openIndex = key;
        } else {
            // Close the clicked element if it's already open
            sett[key].style.display = 'none';
            openIndex = -1;
        }


    }

    useEffect(() => {

        fetch(geturl, {
            method: 'POST',
            body: JSON.stringify({
                name: `${user}`
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        })
            .then((res) => res.json())
            .then((dates) => {
                var date = []
                var all = 0
                if (dates.ok == "true") {
                    for (let i = 0; i < dates.response.length; i++) {
                        date.push({
                            id: dates.response[i].id,
                            type: dates.response[i].type,
                            userprice: dates.response[i].mytype,
                            userget: dates.response[i].price,
                            time: dates.response[i].time
                        });

                        all += parseInt(dates.response[i].price);
                    }
                }

                settotal(all)
                setdate(date)

            })
            .catch((error) => {
                console.error('Error:', error);
            })

        fetch(getID, {
            method: 'POST',
            body: JSON.stringify({
                name: `${user}`
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        })
            .then((res) => res.json())
            .then((dates) => {
                var date = []
                for (let i = 0; i < dates.response.length; i++) {
                    date.push({
                        type: dates.response[i].mtype, price: parseInt(dates.response[i].total_out)

                    })
                }

                setIdDate(date)

                setUserdate({

                    labels: date.map((data) => data.type),
                    datasets: [{
                        label: "$",
                        data: date.map((data) => data.price),
                        backgroundColor: ["#57c1c7", "#c9b95e", "#7dd4b1", "#2f7f8e"]
                    }]
                })

            })
            .catch((error) => {
                console.error('Error:', error);
            })

    }, [0]);

    return (
        <div className="dash">

            <h1>支出清單</h1>
            <hr />
            {total > 0 ? <><div className="circle">
                <PieChart datas={userDate} />
            </div><div className="title">
                    <p>合計: {total}</p>
                    <div className="Idtotal">
                        {IdDate.map((data) => (
                            <h3>{data.type}:{data.price}</h3>
                        ))}
                    </div>
                </div></> : <h1>無資料</h1>}

            {total > 0 ? <div className="table">

                <table>
                    <thead>
                        <tr>

                            <th>日期</th>
                            <th>帳戶</th>
                            <th>分類</th>
                            <th>金額</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(date) && date.length > 0 ? date.map((datas, key) => (
                            <tr key={key} id={key} className="table-all">
                                <input type="hidden" value={datas.id} />
                                <td>
                                    {datas.time}
                                </td>
                                <td>
                                    {datas.userprice}
                                </td>
                                <td>
                                    {datas.type}
                                </td>
                                <td>
                                    {datas.userget}
                                </td>
                                <td><button onClick={() => { opensett(key) }}><i class="fa-solid fa-ellipsis-vertical"></i></button></td>
                                <div className="sett" id={key}>
                                    <button>編輯</button>
                                    <button onClick={() => { del(key) }}>刪除</button>
                                </div>
                            </tr>
                        )) : <h1>快來記錄吧!</h1>}
                    </tbody>
                </table>

            </div> : ""}

            <button className='plus' onClick={add}><i class="fa-solid fa-plus"></i></button>
            <Add onClick={getadd} firsource={"out"} />


        </div >
    )

}

export default DashOut
