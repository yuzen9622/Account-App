import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './change.css'
import './add.css'
function Finances() {
    const [user, setUser] = useState(localStorage.getItem("user"))

    const [source, setSource] = useState("in")
    const [categories, setcategories] = useState([])
    const [isactive, setActive] = useState(true)

    const navigete = useNavigate()
    const getCategories = (source) => {
        setSource(source)
        if (source == "in") {
            setActive(true)
        } else {
            setActive(false)
        }
    }
    function addAcc() {

        var input_1 = document.getElementById('add-acc').value;
        if (input_1 !== "") {
            let newData = [...categories, { type: input_1 }];

            setcategories(newData)


            fetch(`https://yuzen.serveirc.com/account_api/categories.php?user=${user}&source=${source}`, {
                method: "POST", body: JSON.stringify({
                    type: input_1
                })

            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.ok == true) {


                    }
                })
                .catch((err) => {
                    console.error(err);
                })
            close()
        }



    }

    const del = (nub, id) => {

        fetch(`https://yuzen.serveirc.com/account_api/categories.php?user=${user}&source=${source}`, {
            method: "POST", body: JSON.stringify({ id: id })
        })
            .then((res) => res.json()).then((response) => {
                if (response.ok = true) {
                    console.log("delete successful")
                }
            })
            .catch((err) => {
                console.error(err);
            })

        const data = [...categories]
        data.splice(nub, 1)
        setcategories(data)


    }

    const open = () => {
        let popbox = document.getElementsByClassName('add-Acc')[0]
        popbox.style.display = 'flex'
    }

    const close = () => {
        let popbox = document.getElementsByClassName('add-Acc')[0]
        popbox.style.display = 'none'
    }
    useEffect(() => {
        var cateURl = `https://yuzen.serveirc.com/account_api/categories.php?user=${user}&source=${source}`

        fetch(cateURl)
            .then((res) => res.json())
            .then((data) => {
                var datas = [];
                for (let i = 0; i < data.length; i++) {
                    datas.push({
                        id: data[i].id,
                        type: data[i].type
                    })
                }
                setcategories(datas)
            })
            .catch((err) => {
                console.error(err)
            })

    }, [source])

    return (
        <div className="Fixed-Finances">
            <div className="top">
                <button onClick={() => navigete('/setting')}><i class="fa-solid fa-angle-left"></i></button>
                <h3>項目</h3>
                <button onClick={open}><i class="fa-solid fa-plus"></i></button>
            </div>

            <div className="Finances">
                <div className="popbox-btn">
                    <button className={isactive ? 'pop-active' : "in"} onClick={() => { getCategories("in") }}>收入</button><button className={isactive ? "out" : 'pop-active'} onClick={() => { getCategories("out") }}>支出</button>
                </div>
                {categories.length == 0 ? <h1>Loading...</h1> :
                    <>< div className="caregories">

                        {categories.map((datas, key) => (
                            <div className="care-type">
                                <h3>{datas.type}</h3>
                                <button onClick={() => { del(key, datas.id) }}>刪除</button>
                            </div>
                        ))}
                        <div className="care-type">
                            <h3>新增</h3>
                            <button onClick={open}><i class="fa-solid fa-plus"></i></button>
                        </div>

                    </div>
                    </>}
                <div className="add-Acc">
                    <p>新增項目</p>
                    <input type="text" name="" id="add-acc" placeholder='輸入項目' />
                    <div className="add-btn">
                        <button onClick={close}>取消</button>
                        <button onClick={addAcc}>新增</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Finances
