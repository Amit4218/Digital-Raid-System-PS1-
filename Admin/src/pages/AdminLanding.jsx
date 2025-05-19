import React from 'react'
import Navbar from '../component/Navbar'
import {Routes,Route} from "react-router-dom"
import Dashboard from '../component/Dashboard'
import Raids from '../component/Raids'
import UnplannedRaids from '../component/UnplannedRaids'
import PlannedRaid from '../component/PlannedRaid'
import RaidRequest from '../component/RaidRequest'
import PendingReview from '../component/PendingReview'
import ActiveReview from '../component/ActiveReview'
import CompletedReview from '../component/CompletedReview'
import ApprovedReview  from '../component/ApprovedReview'

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
        <Route path='/pending-review' element={<PendingReview/>}/>
        <Route path='/active-review' element={<ActiveReview/>}/>
        <Route path='/completed-review' element={<CompletedReview/>}/>
        <Route path='/approved-review' element={<ApprovedReview/>}/>
      </Routes>
    </div>

  );
}

export default AdminLanding
