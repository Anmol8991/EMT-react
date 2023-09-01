import React, {useState, useEffect} from 'react'
import { Card } from "react-bootstrap";
import {BsPeople} from 'react-icons/bs'
import useAuth from '../../../../hooks/useAuth';
import { notify } from '../../../../utils/toastify';
import { apiGetActiveEmployees } from '../../../../api/admin.api';

const AvailableToday = () => {
  const { signOut } = useAuth()
  const [ value, setValue ] = useState(0)
  useEffect(()=>{
  const controller = new AbortController()

  const fetchValue =  async () => {
    try{
      const response = await apiGetActiveEmployees({signal: controller.signal})
      setValue(parseInt(response?.data?.data?.availableToday))
  }catch(error){
    if(error?.name !== "CanceledError"){
      console.log("Error in Available Today Component: ", error);
      if(error?.response?.data?.status === 401){
        signOut()
      }
    }else{
      console.log("Request Aborted!")
    }
  }
  }
  fetchValue()

  return ()=> {
    controller.abort()
  }
  },[])

  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-start align-items-center fs-4">
          <BsPeople  className="me-2"/>
          <h4>Employees Available Today</h4>
        </div>
      </Card.Header>
      <Card.Body>
        {value}
      </Card.Body>
    </Card>
  )
}

export default AvailableToday
