import { Card  } from "react-bootstrap";
import { apiRegularize } from "../../../api/user.api";
import { notify } from "../../../utils/toastify";
import useAuth from "../../../hooks/useAuth";
import RegularizeForm from "./ReqularizeForm";

const RegularizeAttendance = () => {
    const { signOut } = useAuth()


  const handleSave = async (values, {resetForm}) => {

    console.log("Values in handle Submit: ", values);
    try{
        const response = await apiRegularize(values)
        notify(response?.data?.message, true)
    }catch(error){
        console.log("Error in Regularize Attendance Component: ", error);
        if(error?.response?.data?.status === 401){
            signOut()
        }else if(error?.response?.data?.status === 500){
            notify(error?.response?.data?.message)
        }
    }finally{
        resetForm()    
    }
  };

  return (
    <Card className="m-5 mb-0">
      <Card.Body>
        <Card.Title>
          {" "}
          <h3>Regularize Attendance</h3>{" "}
        </Card.Title>
        <RegularizeForm handleSave={handleSave}/>
        
      </Card.Body>
    </Card>
    
  );
};


export default RegularizeAttendance;
