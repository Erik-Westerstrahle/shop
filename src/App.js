/* App.js here */

import logo from './logo.svg';
import './App.css';
import Header from './Header';
// import LandingPage from './LandingPage.html';


import Shop from './Shop';
import Signup from './Signup';
import Login from './Login';
import {  Route, Routes } from 'react-router-dom';
import Inventory from './myitems';
import Account from './Account';

const API_URL = "http://localhost:8000/"

function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path='/Signup' element={<Signup />} />
          <Route path='/Shop' element={<Shop/>} />
          <Route path='/myitems' element={<Inventory />} />
          <Route path='/' element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
        </div>

 
      
    </div>
  );
}

export default App;
