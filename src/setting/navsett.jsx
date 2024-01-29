import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function Navsett() {
    const navgate = useNavigate()
    const logout = () => {
        localStorage.removeItem("user")
        navgate('/')
        window.location.reload()
    }
    return (
        <div className="console">


            <div className="console-btn">
                <div className="btn-p"><p>基本設定</p></div>
                <div className="btn">

                    <Link to="/setting/fin">類別</Link>
                    <Link to="/setting/account">帳戶</Link>
                    <Link to="">貨幣</Link>

                </div>
                <div className="btn-p"><p>帳號設定</p></div>
                <div className="btn">
                    <Link to="">更改名稱</Link>
                    <Link to="">更改密碼</Link>
                    <Link onClick={logout}>登出</Link>
                </div>

            </div>

        </div>
    )
}

export default Navsett
