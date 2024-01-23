import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const [islogin, setlogin] = useState(false)

    const [user, setuser] = useState(sessionStorage.getItem("user"))
    useEffect(() => {
        if (user) {
            setlogin(true)
        }
    })

    return (<>
        <div className='nav'>

            <div className="name">

                <h1>{user}</h1>

            </div>
            <nav>

                {islogin ? <><li>
                    <NavLink to='/dash/'><i class="fa-solid fa-book"></i><p>記事本</p></NavLink>
                </li> <li><NavLink to='/account'><i class="fa-solid fa-landmark"></i><p>帳戶</p></NavLink></li><li><NavLink to='/chart'><i class="fa-solid fa-chart-simple"></i><p>圖表</p></NavLink></li><li><NavLink to='/setting'><i class="fa-solid fa-gear"></i><p>設定</p></NavLink></li></> : <li><NavLink to='/account'><i class="fa-solid fa-landmark"></i><p>帳戶</p></NavLink></li>}

            </nav>
        </div>

    </>
    )
}

export default Navbar
