import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { HiOutlinePencil } from "react-icons/hi";
import EmployeeDetailForm from "./EmployeeDetailForm";
import useAuth from "../../../../hooks/useAuth";
import { notify } from "../../../../utils/toastify";
import { apiGetEmployeeInfo, apiUpdateEmployeeInfo } from "../../../../api/admin.api";


const EmployeeDetails = () => {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData ] = useState({
    name: "",
    email: "",
    initialPassword: "",
    role: "",
    status: "",
    designation: "",
    dateOfJoining: "",
    salary: "",})
  const [isEditable, setIsEditable] = useState(false);
  const location = useLocation()
  const pathArray = location?.pathname.split('/');

  // const currentValue = usersData[0];
  useEffect(()=>{

    const controller = new AbortController();
    const fetchInfo = async () => {
      try{
        const response = await apiGetEmployeeInfo({id: parseInt(pathArray[pathArray.length - 1])}, { signal: controller.signal })
      // console.log("Response of getRoles request: ", response?.data?.data);
      const newObj = {...response?.data?.data}
        newObj.dateOfJoining = new Date(response?.data?.data?.dateOfJoining)
        setData(newObj)
      
      }catch(error){
        if(error?.name !== "CanceledError"){
          console.log("Error in EmployeesDetails Component: ", error);
          if(error?.response?.data?.status === 401){
            signOut()
          }
        }else{
          console.log("Request Aborted!")
        }
      }
      
    }
    fetchInfo()

    return () => {
      controller.abort()
    };
  }, [])
  
  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleSubmit = async (values, {setFieldValue}) => {
    setIsLoading(true);
    try{
      const payload = {
        id: parseInt(pathArray[pathArray.length - 1]),
        name: values?.name,
        email: values?.email,
        role: values?.role,
        status: values?.status,
        designation: values?.designation,
        dateOfJoining: values?.dateOfJoining,
        salary: JSON.stringify([
          {
            CTC: 1200000,
            hra: 300000,
            Basic: 600000,
            travel: 60000,
            medical: 60000,
            special: 46800,
            incentive: 60000,
            company_insurance: 30000,
            pf_employee_contribution: 21600,
            pf_employer_contribution: 21600,
          },
        ])
      }
      const response = await apiUpdateEmployeeInfo(payload)
      // console.log("Values in handle Submit: ", values);
      notify(response?.data?.message, true)
      
      // Alternate to reseeting the form
      setFieldValue("name",values.name)
      setFieldValue("email",values.email)
      setFieldValue("role",values.role)
      setFieldValue("status",values.status)
      setFieldValue("designation",values.designation)
      setFieldValue("salary",values.salary)
      setIsEditable(false);

    }catch(error){
      if(error?.name !== "CanceledError"){
        console.log("Error in EmployeesDetails Component: ", error);
        if(error?.response?.data?.status === 401){
          signOut()
        }
      }else{
        console.log("Request Aborted!")
      }
    }
    finally{
      setIsLoading(false);
    }

    
  }
  
  return (
    <Card className="m-4">
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between m-4 mb-0">
          <h5>Employee Details</h5>
          <Button
            disabled={isEditable}
            size="sm"
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditable(!isEditable)}
          >
            <span>Edit</span>
          </Button>
        </div>
        <EmployeeDetailForm
          initialData={data}
          isEditable={isEditable}
          handleCancel={handleCancel}
          handleSave={handleSubmit}
        />
      </div>
    </Card>
  );
};

export default EmployeeDetails;
