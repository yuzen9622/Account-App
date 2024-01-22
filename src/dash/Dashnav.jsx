import React from 'react'
import { NavLink } from 'react-router-dom'
import './Dashnav.css'
function Dashnav() {
    return (
        <div className='type'>
            <ul>
                <li>
                    <NavLink to='/dash/in'>收入</NavLink>
                </li>
                <li>
                    <NavLink to='/dash/out'>支出</NavLink>
                </li>

            </ul>
        </div>
    )
}

export default Dashnav
