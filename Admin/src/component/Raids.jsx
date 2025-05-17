import React from 'react'
import Pending from './status/Pending'
import Active from './status/Active'
import Completed from './status/Completed'
import Approved from './status/Approved'

function Raids() {
  return (
    <div>
      <Pending/>
      <Active/>
      <Completed/>
      <Approved/>
    </div>
  )
}

export default Raids
