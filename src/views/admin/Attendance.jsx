import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { notify } from "../../utils/toastify";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/loader/Loading";
import {apiGetEmployees, apiRequestedRegularized, apiRequestedLeave} from "../../api/admin.api.js"
import AttendanceTable from "./components/attendance/AttendanceTable";
import LeaveRequests from "./components/attendance/LeaveRequests";

const initialData = {
  id: "",
  // startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  // endDate: new Date(),
};

const Attendance = () => {
  const {signOut} = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [allEmployee, setAllEmployees] = useState([])
  const [emplyAttendanceData, setEmplyAttendanceData] = useState([]); 
  const [leaveRequests, setLeaveRequests ] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
    try{
      const response = await apiGetEmployees({ signal: controller.signal });
      setAllEmployees(response?.data?.data)
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
    finally{
      setIsLoading(false);
    }
    }
    fetchData()
    
    return ()=>{
      controller.abort()
    }
  }, [])

  const validationSchema = Yup.object().shape({
    id: Yup.number().required("Please Select Name"),
    // startDate: Yup.date().required("This field is required"),
    // endDate: Yup.date()
    //   .required("This field is required")
    //   .test(
    //     "greaterThanStartDate",
    //     "End date must be greater than start date",
    //     function (endDate) {
    //       const { startDate } = this.parent; // Access the value of startDate field
    //       return (
    //         !startDate || !endDate || new Date(endDate) > new Date(startDate)
    //       );
    //     }
    //   ),
  });


  const handleSubmitForm = async (values) => {
    console.log("Values in handle Submit: ", values);
    
    try{
      setIsLoading(true);
      const response = await apiRequestedRegularized({id: values?.id});
      const response2 = await apiRequestedLeave({userId: values?.id})
      setEmplyAttendanceData(response?.data?.data)
      setLeaveRequests(response2?.data?.data)
    }catch(error){
      console.log("Error in Attendance Component: ", error);
        if(error?.response?.data?.status === 401){
          signOut()
        }
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    
    <div className="d-flex flex-column gap-4 m-4">
      <h3> Attendance </h3>
      {isLoading && <Loading />}
      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ values, resetForm, submitForm }) => (
          <Form>
            <div className="form-outer bg-white">
              <div className="container">
                <div className="row row-cols-1 row-cols-md-2">
                  {/* Employee Name Field  */}
                  <div className="col-md-3 col">
                    <div className="form-outline mb-4 text-md-end text-start">
                      <label htmlFor="name">Employee Name:</label>
                    </div>
                  </div>
                  <div className="col-md-9 col">
                  <div className="form-outline mb-4 text-start">
                      <Field name="id">
                        {({ field, form }) => {
                          return (
                            <Select
                              options={allEmployee}
                              getOptionLabel={(employee) => employee.name}
                              getOptionValue={(employee) => employee.id}
                              value={allEmployee.filter(
                                (option) => option.id === values.id
                              )}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option?.id);
                                console.log("field Value: ", option?.id);
                                // Must read: https://github.com/jaredpalmer/formik/issues/1218
                                // if we don't use setTimeout form is submitted with the non updated values of the fields -> workaround NOT the ideal solution
                                setTimeout(submitForm, 0)
                              }}
                              isSearchable={true}
                              placeholder="Search..."
                            />
                          );
                        }}
                      </Field>
                      <ErrorMessage name="id">
                        {(msg) => (
                          <p className="text-start" style={{ color: "red" }}>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  {/* Start Date Field  */}
                  {/* <div className="col">
                    <div className="form-outline mb-4 text-start">
                      <label htmlFor="startDate">Start Date:</label>
                      <Field name="startDate">
                        {({ field, form }) => {
                          return (
                            <DatePicker
                              className="form-control"
                              placeholder="Select Start Date"
                              selected={values.startDate}
                              onChange={(date) => {
                                form.setFieldValue(field.name, date);
                                setTimeout(submitForm, 0)
                              }}
                            />
                          );
                        }}
                      </Field>
                      <ErrorMessage name="startDate">
                        {(msg) => (
                          <p className="text-start" style={{ color: "red" }}>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div> */}
                  {/* End Date Field  */}
                  {/* <div className="col">
                    <div className="form-outline mb-4 text-start">
                      <label htmlFor="endDate">End Date:</label>
                      <Field name="endDate">
                        {({ field, form }) => {
                          return (
                            <DatePicker
                              className="form-control"
                              placeholder="Select End Date"
                              selected={values.endDate}
                              onChange={(date) => {
                                form.setFieldValue(field.name, date);
                                setTimeout(submitForm, 0)
                              }}
                            />
                          );
                        }}
                      </Field>
                      <ErrorMessage name="endDate">
                        {(msg) => (
                          <p className="text-start" style={{ color: "red" }}>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <AttendanceTable data={emplyAttendanceData} />
      <LeaveRequests  data={leaveRequests}/>
    </div>
  );
};

export default Attendance;
