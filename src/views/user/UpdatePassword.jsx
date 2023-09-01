import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button } from "react-bootstrap";
import { notify } from "../../utils/toastify";
import useAuth from "../../hooks/useAuth";
import { apiValidatePassword, apiUpdatePassword } from "../../api/profile.api";

// TODO: Instead of Onblur change it to debouncing on currentPassword field
const UpdatePassword = () => {
  const {signOut} = useAuth()
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  


  const minLengthRegex = /^.{8,}$/;
  const uppercaseRegex = /^(?=.*[A-Z])/;
  const lowercaseRegex = /^(?=.*[a-z])/;
  const numberRegex = /^(?=.*\d)/;
  const specialCharRegex = /^(?=.*[@$!%*?&#])/;
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("This field is required!"),
    newPassword: Yup.string()
    .matches(
      minLengthRegex,
      "Password must be at least 8 characters long."
    )
    .matches(
      uppercaseRegex,
      "Password must contain at least one uppercase letter."
    )
    .matches(
      lowercaseRegex,
      "Password must contain at least one lowercase letter."
    )
    .matches(numberRegex, "Password must contain at least one number.")
    .matches(
      specialCharRegex,
      "Password must contain at least one special character."
    )
    .required("This field is required!"),
    confirmPassword: Yup.string()
    .required("Confirm Password Required")
    .oneOf([Yup.ref("newPassword")], "Confirm Password does NOT match New Password"),
  });

  function handleShowPassword(event) {
    if(event.currentTarget.name === 'current'){
      setShowPassword((prevObj) => {
        const newObj = {...prevObj}
        newObj.current = !prevObj.current
        return newObj
      })
    }else if(event.currentTarget.name === 'new'){
      setShowPassword((prevObj) => {
        const newObj = {...prevObj}
        newObj.new = !prevObj.new
        return newObj
      })
    }
    else{
      setShowPassword((prevObj) => {
        const newObj = {...prevObj}
        newObj.confirm = !prevObj.confirm
        return newObj
      })
    }
  }

  const handleCurrentPassword = async (event) => {
      const response = await apiValidatePassword({currentPassword: event.target.value})
      if(response?.data?.data?.isCorrect){
        setIsCorrect(true)
      }else{
        notify("Please enter correct current password!")
        setIsCorrect(false)
      }
  }

  const handleSubmit = async (values,{resetForm}) => {
    try{
      console.log("Values in handle Submit: ", values);
      const response = await apiUpdatePassword({newPassword: values.newPassword})
      notify(response?.data?.message, true)
      resetForm();
      signOut();
    }catch(error){
      notify(error?.response?.data?.message);
      console.log("Error in UpdatePassword Component: ", error);
      if (error?.response?.data?.status === 401) {
        signOut();
      }
    }
    
    
  };

  return (
    <div
      className="container d-flex align-items-center vh-100"
      style={{ maxWidth: "540px" }}
    > 
      <Card>
        <Card.Body>
          <div className="row row-cols-1 justify-content-center">
            <div className="col">
              <Card.Header>Update your Password</Card.Header>
                <p>
                  You need to update your password as this is the first time you
                  are signing in.
                </p>
                <h5 className="fs-13">Password must contain: </h5>
                <ul>
                  <li id="pass-length">
                    Minimum <b>8 characters</b>
                  </li>
                  <li id="pass-lower">
                    At <b>lowercase</b> letter (a-z)
                  </li>
                  <li id="pass-upper">
                    At least <b>uppercase</b> letter (A-Z)
                  </li>
                  <li id="pass-number">
                    At least <b>number</b> (0-9)
                  </li>
                  <li id="pass-special">
                    At least <b>one special character</b> (@$!%*?&#)
                  </li>
                </ul>       
            </div>
            <div className="col">
              <Formik
              enableReinitialize
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, resetForm }) => (
                  <Form>
                    <div className="form-outer bg-white">
                      <div className="container-fluid">
                        <div className="row mb-4">
                          <div className="col text-center">
                            {/* Current Password */}
                            <div className="form-outline mb-4 text-start">
                                <label className="form-label" htmlFor="email">
                                    Current Password
                                </label>
                            <div className="input-group">
                                <Field name="currentPassword">
                                {({ field, form }) => {
                                    return (
                                    <input
                                        name="new-password"
                                        id="new-password"
                                        autoComplete={showPassword.current ? "off" : "new-password"}
                                        type={showPassword.current ? "text" : "password"}
                                        className="form-control"
                                        placeholder="*******"
                                        value={values.currentPassword}
                                        onChange={(event) => {
                                        form.setFieldValue(field.name, event.target.value);
                                        }}
                                        onBlur={handleCurrentPassword}
                                    />
                                    );
                                }}
                                </Field>
                                <button
                                name="current"
                                type="button"
                                className="btn border"
                                onClick={handleShowPassword}
                                aria-label="Show password as plain text. Warning: this will display your password on the screen."
                                >
                                {showPassword.current  ? (
                                  <i className="bi bi-eye-slash-fill" id="hide_eye"></i>  
                                ) : (
                                  <i className="bi bi-eye-fill" id="show_eye"></i>
                                )}
                                </button>
                            </div>
                            <ErrorMessage name="currentPassword">
                                {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                    {msg}
                                </p>
                                )}
                            </ErrorMessage>
                            </div>
                            {/* New Password */}
                            <div className="form-outline mb-4 text-start">
                                <label className="form-label" htmlFor="email">
                                    New Password
                                </label>
                            <div className="input-group">
                                <Field name="newPassword">
                                {({ field, form }) => {
                                    return (
                                    <input
                                    autoComplete="new-password"
                                        disabled={!isCorrect}
                                        type={showPassword.new ? "text" : "password"}
                                        className="form-control"
                                        placeholder="*******"
                                        value={values.newPassword}
                                        onChange={(event) => {
                                        form.setFieldValue(field.name, event.target.value);
                                        }}
                                    />
                                    );
                                }}
                                </Field>
                                <button
                                name="new"
                                type="button"
                                className="btn border"
                                onClick={handleShowPassword}
                                aria-label="Show password as plain text. Warning: this will display your password on the screen."
                                >
                                {showPassword.new ? (
                                  <i className="bi bi-eye-slash-fill" id="hide_eye"></i>  
                                ) : (
                                  <i className="bi bi-eye-fill" id="show_eye"></i>
                                )}
                                </button>
                            </div>
                            <ErrorMessage name="newPassword">
                                {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                    {msg}
                                </p>
                                )}
                            </ErrorMessage>
                            </div>
                            
                            {/* Confirm Password */}
                            <div className="form-outline mb-4 text-start">
                                <label className="form-label" htmlFor="email">
                                    Confirm Password
                                </label>
                            <div className="input-group">
                                <Field name="confirmPassword">
                                {({ field, form }) => {
                                    return (
                                    <input
                                        autoComplete="new-password"
                                        disabled={!isCorrect}
                                        type={showPassword.confirm ? "text" : "password"}
                                        className="form-control"
                                        placeholder="*******"
                                        value={values.confirmPassword}
                                        onChange={(event) => {
                                        form.setFieldValue(field.name, event.target.value);
                                        }}
                                    />
                                    );
                                }}
                                </Field>
                                <button
                                name="confirm"
                                type="button"
                                className="btn border"
                                onClick={handleShowPassword}
                                aria-label="Show password as plain text. Warning: this will display your password on the screen."
                                >
                                {showPassword.confirm ? (
                                  <i className="bi bi-eye-slash-fill" id="hide_eye"></i>  
                                ) : (
                                  <i className="bi bi-eye-fill" id="show_eye"></i>
                                )}
                                </button>
                            </div>
                            <ErrorMessage name="confirmPassword">
                                {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                    {msg}
                                </p>
                                )}
                            </ErrorMessage>
                            </div>

                            {/* Cancel and Save Button */}
                            <Button
                              className="btn btn-primary w-100 mb-2"
                              type="submit"
                            >
                              Save
                            </Button>
                            <Button
                              type="reset"
                              className="btn btn-secondary w-100"
                              onClick={() => {
                                resetForm();
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdatePassword;
