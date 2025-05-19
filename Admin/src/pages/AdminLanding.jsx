import React from 'react'
import Navbar from '../component/Navbar'
import {Routes,Route} from "react-router-dom"
import Dashboard from '../component/Dashboard'
import Raids from '../component/Raids'
import UnplannedRaids from '../component/UnplannedRaids'
import PlannedRaid from '../component/PlannedRaid'
import RaidRequest from '../component/RaidRequest'

const AdminLanding = () => {
  return (
    <div className="bg-white h-screen w-full  ">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='raids' element={<Raids />} />
        <Route path='unplannedRaids' element={<UnplannedRaids />}/>
        <Route path='/planned-raid'element={<PlannedRaid/>}/>
        <Route path='/unplanned-request' element={<RaidRequest/>}/>
      </Routes>
    </div>

  );
}

export default AdminLanding
