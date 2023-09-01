import { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import useAuth from "../../../../hooks/useAuth";
import { notify } from "../../../../utils/toastify";
import { apiGetAttendance} from "../../../../api/user.api.js";


const Attendance = () => {
  const { signOut } = useAuth();
  const [ attendanceData, setAttendanceData ] = useState({
    present: "",
    totalWorking: "",
  })
useEffect(()=>{
  const controller = new AbortController()

  const fetchAttendance =  async () => {
    try{
      const response = await apiGetAttendance({signal: controller.signal})
      console.log("Response of getAttendance Request: ", response?.data?.data)
      setAttendanceData({
        present: response?.data?.data?.present,
        totalWorking: response?.data?.data?.totalWorking,
      })
  }catch(error){
    if(error?.name !== "CanceledError"){
      console.log("Error in Attendance Component: ", error);
      if(error?.response?.data?.status === 401){
        signOut()
      }
    }else{
      console.log("Request Aborted!")
    }
  }
  }
  fetchAttendance()

  return ()=> {
    controller.abort()
  }
},[])

  return (
    <Card>
      <Card.Header>
        {" "}
        <h4> Attendance </h4>
      </Card.Header>
      <Card.Body className="px-0">
        <div className="container">
          <div className="row mb-2 border-bottom">
            <div className="col-auto">
              <h5 className="text-start">Current Month: </h5>
            </div>
            <div className="col-auto">
              {" "}
              <p className="text-center text-xl-start fs-5">
                {new Date().toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
              </p>
            </div>
          </div>
          <div className="row mb-2 border-bottom">
            <div className="col-auto">
              <h5 className="text-start">Present Days: </h5>
            </div>
            <div className="col-auto">
              {" "}
              <p className="text-center text-xl-start fs-5">{attendanceData.present}</p>
            </div>
          </div>
          <div className="row mb-2 border-bottom">
            <div className="col-auto">
              <h5 className="text-start">Total Working Days: </h5>
            </div>
            <div className="col-auto">
              {" "}
              <p className="text-center text-xl-start fs-5">{attendanceData.totalWorking}</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Attendance;
