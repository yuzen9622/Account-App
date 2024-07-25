import React, { useEffect, useState } from 'react'
import './console.css';
import Finances from './Change';
import Navsett from './navsett';
import Accounttype from './Acctype';
import { NavLink, Route, Routes } from 'react-router-dom';
function Console() {
    const [user, setuser] = useState(localStorage.getItem("user"));
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const timeoutId = setTimeout(() => {

            setIsVisible(false);
        }, 3000);


        return () => clearTimeout(timeoutId);
    }, []); // 

    return (
        <>

            <div className="console">
                <div className="header">
                    <h1>設定</h1>
                    <hr />

                    {isVisible ? <h1>歡迎{user}</h1> : null}
                </div>
                <Routes >
                    <Route path='/' element={<Navsett />} />
                    <Route path='fin' element={<Finances />} />
                    <Route path='account' element={<Accounttype />} />
                </Routes>
            </div>


        </>)
}

export default Console
