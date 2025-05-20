import React from 'react'
import Navbar from '../component/Navbar'
import {Routes,Route} from "react-router-dom"
import Dashboard from '../component/Dashboard'
import Raids from '../component/Raids'
import UnplannedRaids from '../component/UnplannedRaids'
import PlannedRaid from '../component/PlannedRaid'
import Logs from '../component/status/Logs'

const AdminLanding = () => {
  return (
    <div className="bg-white h-screen w-full  ">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='raids' element={<Raids />} />
        <Route path='unplannedRaids' element={<UnplannedRaids />} />
        <Route path='logs' element={<Logs />} />
        <Route path='planned-raid'element={<PlannedRaid/>}/>
      </Routes>
    </div>

  );
}

export default AdminLanding
