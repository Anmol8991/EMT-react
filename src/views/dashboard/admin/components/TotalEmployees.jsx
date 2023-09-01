import React,{ useState, useEffect }from 'react'
import { Card, Button } from "react-bootstrap";
import useAuth from "../../../../hooks/useAuth"
import {BsPeopleFill} from 'react-icons/bs'
import {apiGetEmployees } from "../../../../api/admin.api.js"


const TotalEmployees = () => {
  const { signOut } = useAuth();
  const [total, setTotal ] = useState(0);

  useEffect(() => {
    const controller = new AbortController()
    

    const fetchTotal = async () => {
      try{
        const response = await apiGetEmployees({signal: controller.signal})
        setTotal(response?.data?.data.length)
      }catch(error){
        if(error?.name !== "CanceledError"){
          console.log("Error in TotalEmployees Component: ", error);
          if(error?.response?.data?.status === 401){
            signOut()
          }
        }else{
          console.log("Request Aborted!")
        }
      }     
    }
    fetchTotal()
    return ()=> {
      controller.abort()
    }
  })

    const handlePost = ( ) => {
        console.log("Pressed Post")
    }
  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-start align-items-center fs-4">
          <BsPeopleFill className="me-2"/>
          <h4>Total Nuber of Employees</h4>
        </div>
      </Card.Header>
      <Card.Body>
        {total}
      </Card.Body>
    </Card>
  )
}

export default TotalEmployees
