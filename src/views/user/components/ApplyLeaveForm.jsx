import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {  Button } from "react-bootstrap";
import Select from 'react-select';
import moment from "moment";
import DatePicker from "react-datepicker";
import useAuth from "../../../hooks/useAuth";
import { apiAvailableLeaves } from "../../../api/user.api";


const ApplyLeaveForm = ({isEditable, initialData, handleCancel, handleSave }) => {
    const { signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const initialStatus = initialData?.status
 
  const typeOptions = [
    {value: 'paid', label: 'Paid Leave'},
    {value: 'casual', label: 'Casual Leave'},
    {value: 'sick', label: 'Sick Leave'},
    {value: 'unpaid', label: 'Unpaid Leave'},

  ]
  const validationSchema = Yup.object().shape({
    leaveType: Yup.string().required("This field is required"),
    startDate: Yup.date().required("This field is required")
                  .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Start Date must be greater than current date'),
    endDate: Yup.date().required("This field is required")
                .min(Yup.ref('startDate'), 'End Date must be greater than Start Date'),
    availableLeaves: Yup.number().required("This field is required"),
    appliedLeaves: Yup.number()
        .test(
            "is-less-than-available",
            "Applied leaves should not be greater than available leaves",
            function (appliedLeaves) {
                // console.log("Object that called the callback function: ",this);
            const availableLeaves = this.parent.availableLeaves || 0; // Default to 0 if not provided
            return appliedLeaves <= availableLeaves;
            }
        )
        .required("This field is required"),
  });

// MUST READ:  "this" keyword and arrow functions

// function (appliedLeaves) {
//     const availableLeaves = this.parent.availableLeaves || 0; // Default to 0 if not provided
//     return appliedLeaves <= availableLeaves;
//     }
// The above works because the function is defined normally, but if we use arrow functions instead it doesn't work and shows error => can't read property parent of undefined => meaning 'this' is undefined
// Funtion defined using Arrow Syntax
// (appliedLeaves) => {
//     const availableLeaves = this.parent.availableLeaves || 0; // Default to 0 if not provided
//     return appliedLeaves <= availableLeaves;
//     }
// Solution: automatically passes it as input just need to use it 
// (appliedLeaves, context) => {
//         const availableLeaves = context.parent.availableLeaves || 0; // Default to 0 if not provided
//         return appliedLeaves <= availableLeaves;
//         }

const handleLeaveType = async (value) => {
  try{
    setIsLoading(true);
    const response = await apiAvailableLeaves({leaveType: value});
    return response?.data?.data

  }catch(error){
    console.log("Error in Apply Leave Component: ", error);
    if(error?.response?.data?.status === 401){
      signOut()
    }
  }finally{
    setIsLoading(false);
  }
};

//   const handleSubmit = async (values, {resetForm}) => {
    
//     console.log("Values in handle Submit: ", values);
//     try{
//       setIsLoading(true);
//       const response = await apiApplyLeave(values)
//       notify(response?.data?.message, true)
//       resetForm()
//     }catch(error){
//       console.log("Error in Apply Leave Component: ", error);
//       if(error?.response?.data?.status === 401){
//         signOut()
//       }
//     }finally{
//       setIsLoading(false);
//     }
    

//   };
const handleSubmit = async (values, {resetForm}) => {
    setIsLoading(true);
    const response = await handleSave(values, {resetForm})
    setIsLoading(false);   
  };

  return (
    <Formik
        enableReinitialize
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, resetForm }) => (
            <Form>
              <div className="form-outer bg-white p-4">
                <div className="container">
                  <div className="row row-cols-1 row-cols-md-2">
                    {/* <!-- Leave Type input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="name">
                          Leave Type:
                        </label>
                        <Field name="leaveType">
                          {({ field, form }) => {
                            return (
                                <Select
                                isDisabled={!isEditable}
                                    field={field}
                                    form={form}
                                    className="basic-single"
                                    placeholder="Select Leave Type"
                                    options={typeOptions}
                                    value={typeOptions.filter((option) => option.value === values.leaveType)}
                                    onChange={(option) =>{
                                      form.setFieldValue(field.name, option?.value)
                                      handleLeaveType(option.value)
                                        .then((response) => {
                                          form.setFieldValue("availableLeaves", response?.availableLeaves)
                                        })
                                        .catch((error) => console.log(error))
                                    }}
                                />
                            );
                          }}
                        </Field>
                        <ErrorMessage name="leaveType">
                          {(msg) => (
                            <p className="text-start" style={{ color: "red" }}>
                              {msg}
                            </p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    {/* <!-- Available Leaves field --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="role">
                          Available Leaves:
                        </label>
                        <Field name="availableLeaves">
                          {({ field, form }) => {
                            return (
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                placeholder="Number of Available Leaves"
                                value={values.availableLeaves}
                              />
                            );
                          }}
                        </Field>
                      </div>
                    </div>
                    {/* <!-- Start Date input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                          Start Date:
                        </label>
                        <Field name="startDate">
                          {({ field, form }) => {
                            return (
                              <DatePicker
                              disabled={!isEditable}
                                className="form-control"
                                placeholder="Select Start Date"
                                selected={values.startDate}
                                onChange={(date) => {
                                  form.setFieldValue(
                                    field.name,
                                    date
                                  );
                                  // Calculate business days (excluding weekends)
                                  const startDate = moment(date);
                                  const endDate = moment(values.endDate);
                                  let diffDays = 0;
                                  
                                  while (startDate.isSameOrBefore(endDate)) {
                                    if (startDate.day() !== 0 && startDate.day() !== 6) {
                                      diffDays++;
                                    }
                                    startDate.add(1, 'days');
                                  }
                                  form.setFieldValue('appliedLeaves',diffDays);
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
                    </div>
                    {/* <!-- End Date input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                          End Date:
                        </label>
                        <Field name="endDate">
                          {({ field, form }) => {
                            return (
                              <DatePicker
                                disabled={!isEditable}
                                className="form-control"
                                placeholder="Select End Date"
                                selected={values.endDate}
                                onChange={(date) => {
                                  form.setFieldValue(field.name, date);
                                  // Calculate business days (excluding weekends)
                                  const startDate = moment(values.startDate);
                                  const endDate = moment(date);
                                  let diffDays = 0;
                                  
                                  while (startDate.isSameOrBefore(endDate)) {
                                    if (startDate.day() !== 0 && startDate.day() !== 6) {
                                      diffDays++;
                                    }
                                    startDate.add(1, 'days');
                                  }
                                  form.setFieldValue('appliedLeaves',diffDays);
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
                    </div>
                    {/* <!-- Number of Days Applied input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                          Number of Leaves Applied:
                        </label>
                        <Field name="appliedLeaves">
                          {({ field, form }) => {
                            return (
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                placeholder="Leaves Applied"
                                value={values.appliedLeaves}
                              />
                            );
                          }}
                        </Field>
                        <ErrorMessage name="appliedLeaves">
                          {(msg) => (
                            <p className="text-start" style={{ color: "red" }}>
                              {msg}
                            </p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                  </div>
                  {isEditable && (<div className="container-fluid">
                    <div className="row">
                      <div className=" col-4 col-sm-8"></div>
                      <div className=" col-8 col-sm-4 d-flex gap-2 p-0">
                        <div className="flex-grow-1">
                          <Button
                            type="reset"
                            className="btn btn-secondary w-100"
                            onClick={() => {
                              resetForm();
                              handleCancel()
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        <div className="flex-grow-1 ">
                          <Button
                            className="btn btn-secondary w-100"
                            type="submit"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>)}
                </div>
                
              </div>
            </Form>
          )}
        </Formik>
  );
};

ApplyLeaveForm.defaultProps = {
    isEditable: true,
    initialData:{
        leaveType: "",
        startDate: "",
        endDate: "",
        availableLeaves: "",
        appliedLeaves: 0,
      },
    handleCancel: () => console.log("pressed Cancel"),
    handleSave: (values) => console.log("Values in handleSubmit: ", values)
}

export default ApplyLeaveForm;
