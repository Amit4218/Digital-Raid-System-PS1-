import React from 'react'
import Pending from './status/Pending'
import Active from './status/Active'
import Completed from './status/Completed'
import Approved from './status/Approved'
import { Navigate, useNavigate } from 'react-router-dom'

function Raids() {
  const navigate = useNavigate()
  const handleCreateRaid =()=>{
    navigate('/admin/planned-raid')
  }
  return (
    <div>
      <Pending />
      <Active />
      <Completed />
      <Approved />
      <div>
        <button 
        onClick={handleCreateRaid}
        className="bg-[#213448] text-white p-2 rounded-xl  fixed bottom-4 right-4">
          Create new raid
        </button>
      </div>
    </div>
  );
}

export default Raids
