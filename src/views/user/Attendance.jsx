import React from 'react'
import RegularizeAttendance from './components/RegularizeAttendance'
import RequestedRegularize from './components/RequestedRegularize'

const Attendance = () => {

  return (
    <>
      <div>
        <RegularizeAttendance/>
        <RequestedRegularize/>
      </div>
    </>
  )
}

export default Attendance