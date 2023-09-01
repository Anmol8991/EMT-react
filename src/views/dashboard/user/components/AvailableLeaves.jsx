import {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import { apiGetAvailableLeaves } from "../../../../api/user.api";
import useAuth from "../../../../hooks/useAuth";

const AvailableLeaves = () => {
  const { signOut } = useAuth();
  const [leaves, setLeaves ] = useState({
    paid: "",
    casual: "",
    sick: "",
  })


useEffect(()=>{
  const controller = new AbortController()

  const fetchLeaves =  async () => {
    try{
      const response = await apiGetAvailableLeaves({signal: controller.signal})
      setLeaves({
        paid: response?.data?.data?.paid_leave_balance,
        casual: response?.data?.data?.casual_leave_balance,
        sick: response?.data?.data?.sick_leave_balance,
      })

  }catch(error){
    if(error?.name !== "CanceledError"){
      console.log("Error in Available Leaves Component: ", error);
      if(error?.response?.data?.status === 401){
        signOut()
      }
    }else{
      console.log("Request Aborted!")
    }
  }
  }
  fetchLeaves()

  return ()=> {
    controller.abort()
  }
},[])


  return (
    <Card className="h-100">
      <Card.Header>
        {" "}
        <h4> Available Leaves </h4>
      </Card.Header>
      <Card.Body  className="d-flex align-items-center">
        <table className="table table-striped">
          <thead>
          <tr>
            <th className="border"><strong>Paid Leave</strong></th>
            <th className="border"><strong>Casual Leave</strong></th>
            <th className="border"><strong>Sick Leave</strong></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className="border">{leaves.paid}</td>
            <td className="border">{leaves.casual}</td>
            <td className="border">{leaves.sick}</td>
          </tr>
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
};

export default AvailableLeaves;
