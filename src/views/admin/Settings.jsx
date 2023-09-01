/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { HiOutlinePencil } from "react-icons/hi";
import { notify } from "../../utils/toastify";
import useAuth from "../../hooks/useAuth";
import { apiSettings } from "../../api/admin.api";
import Loading from "../../components/loader/Loading";
import SettingsForm from "./components/SettingsForm";
import { apiUpdateSettings } from "../../api/admin.api";

// type initialData = {
//   name: string,
//   workingHours: number | null,
//   paidLeavePolicy: number | null,
//   casualLeavePolicy: number | null,
//   sickLeavePolicy: number | null,
//   salaryCycle: number | null,
// }

const Salary = () => {
  const { signOut } = useAuth();
  const [initialValue, setInitialValue] = useState({
    name: "",
    workingHours: "",
    paidLeavePolicy: "",
    casualLeavePolicy: "",
    sickLeavePolicy: "",
    salaryCycle: "",
  });
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSettings = async () => {
      try {
        const response = await apiSettings({ signal: controller.signal });
        setInitialValue({
          name: response?.data?.data?.name,
          workingHours: response?.data?.data?.wrk_hrs,
          paidLeavePolicy: response?.data?.data?.paid_policy,
          casualLeavePolicy: response?.data?.data?.casual_policy,
          sickLeavePolicy: response?.data?.data?.sick_policy,
          salaryCycle: response?.data?.data?.salary_cycle,
        });
      } catch (error) {
        if(error?.name !== "CanceledError"){
          console.log("Error in Settings Component: ", error);
          if(error?.response?.data?.status === 401){
            signOut()
          }
        }else{
          console.log("Request Aborted!")
        }
      }
    };

    fetchSettings();
    
    return () => {
      controller.abort()
    };
  }, []);

  const handleCancel = () => {
    setIsEditable(false);
  };
  const handleSave = async (formData) => {
    console.log("Form Data in Settings Component: ", formData);
    try{
      const response = await apiUpdateSettings(formData);
      notify(response?.data?.message, true);
      setIsEditable(false);
    }
    catch(error){
      notify(error?.response?.data?.message);
      console.log("Error in Settings Component: ", error);
      if (error?.response?.data?.status === 401) {
        signOut();
      }
    }
    
  };
  return (
    <Card className="m-4">
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between m-4 mb-0">
          <h5>Settings</h5>
          <Button
            disabled={isEditable}
            size="sm"
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditable(!isEditable)}
          >
            <span>Edit</span>
          </Button>
        </div>
        <SettingsForm
          initialData={initialValue}
          isEditable={isEditable}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
      </div>
    </Card>
  );
};

export default Salary;
