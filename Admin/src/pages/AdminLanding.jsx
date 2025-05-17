import React from 'react'
import Navbar from '../component/Navbar'
import {Routes,Route} from "react-router-dom"
import Dashboard from '../component/Dashboard'

const AdminLanding = () => {
  return (
    <div className="bg-white h-screen w-full  ">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default AdminLanding
