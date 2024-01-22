import React, { useState, useEffect } from 'react'
import './Dash.css';
import Dashnav from './Dashnav';
import Dashin from './in/In';
import Total from './all/Total';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import DashOut from './out/Out';

function Dash() {
    const [user, setuser] = useState(sessionStorage.getItem("user"));
    const navagate = useNavigate()
    useEffect(() => {
        if (!user) {
            navagate('/account')
        }
    })



    return (
        <div className="dash">
            <Dashnav />
            <Routes>
                <Route path='/' element={<Navigate to='/dash/out' />} />
                <Route path='in' element={<Dashin />} />
                <Route path='out' element={<DashOut />} />
                <Route path='all' element={<Total />} />
            </Routes>
        </div>

    )
}

export default Dash
