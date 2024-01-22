import React, { useEffect, useState, } from 'react';
import './Acc.css';

function Acc() {

    const [islogin, setlogin] = useState(false)
    const [user, setuser] = useState(sessionStorage.getItem("user"))
    const [logmoment, setlog] = useState("登入來使用記帳")

    useEffect(() => {
        if (user) {
            window.location.replace('/dash/out')
        }

        console.log(user)
    }, [user])
    let moments = "login"
    var loginURL = 'http://oscar689.atwebpages.com/account_api/login.php';
    var signURl = 'http://oscar689.atwebpages.com/account_api/sign.php'
    var cheakURl = 'http://oscar689.atwebpages.com/account_api/cheak.php'
    const [error, setError] = useState("");
    const change = (moment) => {

        let log = document.getElementById('login');
        let sig = document.getElementById('sign');
        if (moment == 'login') {
            log.classList.add('active');
            sig.classList.remove('active');
            document.getElementsByClassName('login')[0].style.display = 'flex'
            document.getElementsByClassName('sign')[0].style.display = 'none'
            setlog("登入來使用記帳")
            setError("")
        } else {
            log.classList.remove('active');
            sig.classList.add('active');
            document.getElementsByClassName('login')[0].style.display = 'none'
            document.getElementsByClassName('sign')[0].style.display = 'flex'
            setlog("快來創建帳號")
            setError("")
        }

    }
    function hasWhitespace(input) {
        return /\s/.test(input);
    }

    const cheak = () => {
        let user = document.getElementById('sig-name').value
        let pass = document.getElementById('sig-pass').value
        fetch(cheakURl, {
            method: "POST",
            body: JSON.stringify({
                'user': user
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok == "true") {

                    return false
                } else {
                    return true
                }
            })
        if (pass.length < 8) {
            setError("設置至少8位數密碼");
            return false
        } else {
            return true
        }
    }

    const sign = () => {
        let user = document.getElementById('sig-name').value
        let pass = document.getElementById('sig-pass').value
        if (!hasWhitespace(user) && !hasWhitespace(pass)) {

            fetch(signURl, {
                method: "POST",
                body: JSON.stringify({
                    'user': user,
                    'pass': pass
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.ok == "true") {
                        setError(data.error);
                        window.location.reload()
                    } else {
                        setError(data.error)
                    }
                })


        } else {
            setError("請輸入名稱與密碼")
        }

    }

    const login = () => {
        let user = document.getElementById('log-name').value
        let pass = document.getElementById('log-pass').value
        fetch(loginURL, {
            method: "POST",
            body: JSON.stringify({
                'user': user,
                'pass': pass
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok == "true") {
                    setuser(user)
                    sessionStorage.setItem("user", user)
                    setlogin(true)

                } else {
                    setError("名稱或密碼錯誤!")
                }
            })
            .catch((err) => [
                console.log(err)
            ])
    }


    return (<>
        <div className="acc">
            <h1>{logmoment}</h1>
            <div className="change">
                <button id='login' className='active' onClick={() => { change("login") }}>登入</button>
                <button id='sign' onClick={() => { change("sign") }}>註冊</button>
            </div>
            <div className="login">
                <h3>登入</h3>
                <div className="user">
                    <label htmlFor="log-name">帳戶 </label>
                    <input type="text" id='log-name' placeholder='輸入帳名' />
                </div>
                <div className="user">
                    <label htmlFor="log-pass">密碼 </label>
                    <input type="password" id='log-pass' placeholder='輸入密碼' />
                </div>
                <p>{error}</p>
                <button onClick={login}>登入</button>
            </div>
            <div className="sign">
                <h3>註冊</h3>
                <div className="user">
                    <label htmlFor="sig-name">帳戶 </label>
                    <input type="text" id='sig-name' placeholder='創建帳名' />
                </div>
                <div className="user">
                    <label htmlFor="sig-pass">密碼 </label>
                    <input type="password" id='sig-pass' placeholder='創建密碼' />
                </div>
                <p>{error}</p>
                <button onClick={() => { sign(); }}>註冊</button>
            </div>
        </div>
    </>)
}

export default Acc
