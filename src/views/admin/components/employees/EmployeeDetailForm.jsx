/* eslint-disable react/prop-types */
import {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { apiRoles, apiStatus, apiDesignation } from "../../../../api/admin.api";
import { notify } from "../../../../utils/toastify";
import Loading from "../../../../components/loader/Loading";
import useAuth from "../../../../hooks/useAuth.js";


// type initialData = {
//   name: string,
//   role: string,
//   email: string,
//   password: string,
//   designation: string,
//   salary: number | null,
// }

const EmployeeDetailForm = ({ initialData, isEditable, handleCancel, handleSave }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [options, setOptions] = useState({
    roles: [],
    status: [],
    designation: []
  })
  const pathArray = location.pathname.split("/");
  // console.log(pathArray[pathArray.length - 1])



  // Race condition problem solved using boolean "isComponentMounted" another solution is using Abort Controller
  // Must Read: https://dev.to/saranshk/avoiding-race-conditions-and-memory-leaks-in-react-useeffect-3mme
  useEffect(() => {

    const controller = new AbortController();
    const fetchRoles = async () => {
      try{
        const response = await apiRoles({ signal: controller.signal })
      // console.log("Response of getRoles request: ", response?.data?.data);
      setOptions((prevObj) => {
        const newObj = {...prevObj}
        newObj.roles = response?.data?.data;
        return newObj
      })
      
      }catch(error){
        if(error?.name !== "CanceledError"){
          console.log("Error in EmployeesDetailsForm Component: ", error);
          if(error?.response?.data?.status === 401){
            signOut()
          }
        }else{
          console.log("Request Aborted!")
        }
      }
      
    }
    const fetchStatus = async () => {
      try{
        const response = await apiStatus({ signal: controller.signal })
      // console.log("Response of getStatus request: ", response?.data?.data);
      setOptions((prevObj) => {
        const newObj = {...prevObj}
        newObj.status = response?.data?.data;
        return newObj
      })
      
      }catch(error){
        if(error?.name !== "CanceledError"){
          console.log("Error in EmployeesDetailsForm Component: ", error);
          if(error?.response?.data?.status === 401){
            signOut()
          }
        }else{
          console.log("Request Aborted!")
        }
      }
      
    }
    const fetchDesignation = async () => {
      try{
        const response = await apiDesignation({ signal: controller.signal })
      // console.log("Response of getDesignation request: ", response?.data?.data);
      setOptions((prevObj) => {
        const newObj = {...prevObj}
        newObj.designation = response?.data?.data;
        return newObj
      })
      
      }catch(error){
        if(error?.name !== "CanceledError"){
          console.log("Error in EmployeesDetailsForm Component: ", error);
          if(error?.response?.data?.status === 401){
            signOut()
          }
        }else{
          console.log("Request Aborted!")
        }
      }
      
    }
    fetchRoles()
    fetchStatus()
    fetchDesignation()
    return () => {

      controller.abort()
    };
  }, [])

  

  const minLengthRegex = /^.{8,}$/;
  const uppercaseRegex = /^(?=.*[A-Z])/;
  const lowercaseRegex = /^(?=.*[a-z])/;
  const numberRegex = /^(?=.*\d)/;
  const specialCharRegex = /^(?=.*[@$!%*?&#])/;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter Name"),
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your Email"),
    dateOfJoining: Yup.date().required("This field is required"),
    role: Yup.string().required("Please Select Role"),
    status: Yup.string().required("Please Select Status"),
    password: Yup.string().when('id', {
      is: () => pathArray[pathArray.length - 1] === "addEmployee",
      then: () => Yup.string()
        .matches(minLengthRegex, "Password must be at least 8 characters long.")
        .matches(uppercaseRegex, "Password must contain at least one uppercase letter.")
        .matches(lowercaseRegex, "Password must contain at least one lowercase letter.")
        .matches(numberRegex, "Password must contain at least one number.")
        .matches(specialCharRegex, "Password must contain at least one special character.")
        .required("This field is required!"),
    }),
    designation: Yup.string().required("Please Select Designation"),
    salary: Yup.string().required("Please Enter Salary"),
  });

  // const handleSubmit = (values, { resetForm }) => {
  //   handleSave(values);
  //   resetForm();
  // }

  return (
    <Formik
      enableReinitialize
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {({ values, resetForm }) => (
        <Form>
          <div className="form-outer bg-white p-4">
            <div className="container">
              <div className="row row-cols-1 row-cols-md-2">
                {/* <!-- Name input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label" htmlFor="name">
                      Name:
                    </label>
                    <Field name="name">
                      {({ field, form }) => {
                        return (
                          <input
                            disabled={!isEditable}
                            type="text"
                            className="form-control"
                            placeholder="Enter Name"
                            value={values.name}
                            onChange={(event) => {
                              form.setFieldValue(
                                field.name,
                                event.target.value
                              );
                            }}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="name">
                      {(msg) => (
                        <p className="text-start" style={{ color: "red" }}>
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
                {/* <!-- Email input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label" htmlFor="email">
                      Email address:
                    </label>
                    <Field name="email">
                      {({ field, form }) => {
                        return (
                          <input
                            disabled={!isEditable}
                            type="text"
                            className="form-control"
                            placeholder="youremail@gmail.com"
                            value={values.email}
                            onChange={(event) => {
                              form.setFieldValue(
                                field.name,
                                event.target.value
                              );
                            }}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="email">
                      {(msg) => (
                        <p className="text-start" style={{ color: "red" }}>
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
                {/*  Password Input */}
                {pathArray[pathArray.length - 1] === "addEmployee" && (
                  <div className="col">
                    <div className="form-outline mb-4 text-start">
                      <label className="form-label" htmlFor="email">
                        Initial Password:
                      </label>
                      <Field name="password">
                        {({ field, form }) => {
                          return (
                            <input
                              disabled={!isEditable}
                              type="password"
                              autoComplete="new-password"
                              className="form-control"
                              placeholder="*******"
                              value={values.password}
                              onChange={(event) => {
                                form.setFieldValue(
                                  field.name,
                                  event.target.value
                                );
                              }}
                            />
                          );
                        }}
                      </Field>
                      <ErrorMessage name="password">
                        {(msg) => (
                          <p className="text-start" style={{ color: "red" }}>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                )}
                {/* Date of Joining  */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label">Date of Joininig:</label>
                    <Field name="dateOfJoining">
                      {({ field, form }) => {
                        return (
                          <DatePicker
                            disabled={pathArray[pathArray.length - 1] !== "addEmployee"}
                            className="form-control"
                            placeholderText="Select Date of Joining"
                            selected={values.dateOfJoining}
                            onChange={(date) => {
                              form.setFieldValue(field.name, date);
                            }}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="dateOfJoining">
                      {(msg) => (
                        <p className="text-start" style={{ color: "red" }}>
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
                {/* <!-- Role field --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label" htmlFor="role">
                      Role:
                    </label>
                    <Field name="role">
                      {({ field, form }) => {
                        return (
                          <Select
                            isDisabled={!isEditable}
                            field={field}
                            form={form}
                            className="basic-single"
                            placeholder="Select Role"
                            // name="leaveType"
                            options={options.roles}
                            value={options.roles.filter(
                              (option) => option.value === values.role
                            )}
                            onChange={(option) =>
                              form.setFieldValue(field.name, option?.value)
                            }
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="role">
                      {(msg) => (
                        <p className="text-start" style={{ color: "red" }}>
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* <!-- Status field --> */}
                <div className="col">
                    <div className="form-outline mb-4 text-start">
                      <label className="form-label" htmlFor="role">
                        Status:
                      </label>
                      <Field name="status">
                        {({ field, form }) => {
                          return (
                            <Select
                              isDisabled={pathArray[pathArray.length - 1] !== "addEmployee" ? !isEditable : true}
                              field={field}
                              form={form}
                              className="basic-single"
                              placeholder="Select Status"
                              // name="leaveType"
                              options={options.status}
                              value={options.status.filter(
                                (option) => option.value === values.status
                              )}
                              onChange={(option) =>
                                form.setFieldValue(field.name, option?.value)
                              }
                            />
                          );
                        }}
                      </Field>
                      <ErrorMessage name="status">
                        {(msg) => (
                          <p className="text-start" style={{ color: "red" }}>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                {/* <!-- Designation input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label">
                      Designation:
                    </label>
                    <Field name="designation">
                      {({ field, form }) => {
                        return (
                          <Select
                            isDisabled={!isEditable}
                            field={field}
                            form={form}
                            className="basic-single"
                            placeholder="Select Designation"
                            // name="leaveType"
                            options={options.designation}
                            value={options.designation.filter(
                              (option) => option.value === values.designation
                            )}
                            onChange={(option) =>
                              form.setFieldValue(field.name, option?.value)
                            }
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="designation">
                      {(msg) => (
                        <p className="text-start" style={{ color: "red" }}>
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* <!-- Salary input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label" htmlFor="email">
                      Salary:
                    </label>
                    <Field name="salary">
                      {({ field, form }) => {
                        return (
                          <input
                            disabled={!isEditable}
                            type="number"
                            className="form-control"
                            placeholder="Enter Employee CTC"
                            value={values.salary}
                            onChange={(event) => {
                              form.setFieldValue(
                                field.name,
                                event.target.value
                              );
                            }}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="salary">
                      {(msg) => (
                        <p className="text-start" style={{ color: "red" }}>
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel and Save Button */}
            {isEditable && (
              <div className="container-fluid">
                <div className="row">
                  <div className=" col-4 col-sm-8"></div>
                  <div className=" col-8 col-sm-4 d-flex gap-2 p-0">
                    <div className="flex-grow-1">
                      <Button
                        type="reset"
                        className="btn btn-secondary w-100"
                        onClick={() => {
                          resetForm();
                          handleCancel();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="flex-grow-1 ">
                      <Button className="btn btn-secondary w-100" type="submit">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

EmployeeDetailForm.defaultProps = {
  initialData: {
    name: "",
    email: "",
    dateOfJoining: "",
    role: "",
    status: "inactive",
    password: "",
    designation: "",
    salary: "",
  },
  isEditable: true,
  handleCancel: () => {console.log("Pressed Cancel Button")},
  handleSave: (formData) => {console.log("Handle Save not passed")}
};

export default EmployeeDetailForm;
