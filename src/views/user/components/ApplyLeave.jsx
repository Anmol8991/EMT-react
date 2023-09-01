import React,{ useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button } from "react-bootstrap";
import Select from 'react-select';
import moment from "moment";
import DatePicker from "react-datepicker";
import useAuth from "../../../hooks/useAuth";
import { apiAvailableLeaves, apiApplyLeave } from "../../../api/user.api";
import { notify } from "../../../utils/toastify";
import ApplyLeaveForm from "./ApplyLeaveForm";


const ApplyLeave = () => {
    const { signOut } = useAuth();

  const handleSave = async (values, {resetForm}) => {
    
    try{
      const response = await apiApplyLeave(values)
      notify(response?.data?.message, true)
      resetForm()
    }catch(error){
      console.log("Error in Apply Leave Component: ", error);
      if(error?.response?.data?.status === 401){
        signOut()
      }
    }
  };

  return (
    <Card className="m-5 mb-0">
      <Card.Body>
        <Card.Title>
          {" "}
          <h3>Apply Leave</h3>{" "}
        </Card.Title>
        <ApplyLeaveForm handleSave={handleSave}/>
      </Card.Body>
    </Card>
  );
};

export default ApplyLeave;
