import logo from './logo.svg';
import './App.css';
import Navbar from './nav/navbar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dash from './dash/Dash';
import Acc from './account/Acc';
import { useEffect, useState } from 'react';
import Account from './account/Account';
import Chart from './chart/Chart';
import Console from './setting/Console';

function App() {

  const [islogin, setlogin] = useState(false)
  const [user, setuser] = useState(localStorage.getItem("user"))
  useEffect(() => {
    if (user) {
      setlogin(true)
    }
  })

  return (

    <div className="App">

      <Navbar />
      <Routes >
        <Route path={'/'} element={user ? <Navigate to='/dash/' /> : <Navigate to='/account' />} />
        <Route path='/dash/*' element={<Dash />} />
        <Route path='/account' element={<Account />} />
        <Route path='/chart' element={<Chart />} />
        <Route path='/setting/*' element={<Console />} />

      </Routes>

    </div>

  );
}

export default App;
