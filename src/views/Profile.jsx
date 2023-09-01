import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button } from "react-bootstrap";
import { notify } from "../utils/toastify";
import useAuth from "../hooks/useAuth";
import Loading from "../components/loader/Loading";
import { apiGetInfo, apiUpdateInfo, apiValidatePassword, apiUpdatePassword } from "../api/profile.api";

// TODO: Instead of Onblur change it to debouncing on currentPassword field
const Profile = () => {
  const { signOut } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    designation: "",
    changePassword: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  

  useEffect(()=>{
    const controller = new AbortController();

    const fetchInfo = async () => {
      try{
        const response = await apiGetInfo({ signal: controller.signal })
      // console.log("Response of getRoles request: ", response?.data?.data);
      setFormData((prevObj) => {
        const newObj = {...prevObj}
        newObj.name = response?.data?.data?.name;
        newObj.email = response?.data?.data?.email;
        newObj.role = response?.data?.data?.role;
        newObj.designation = response?.data?.data?.designation;
        return newObj
      })
      
      }catch(error){
        if(error?.name !== "CanceledError"){
        console.log("Error in Profile Component: ", error);
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



  const minLengthRegex = /^.{8,}$/;
  const uppercaseRegex = /^(?=.*[A-Z])/;
  const lowercaseRegex = /^(?=.*[a-z])/;
  const numberRegex = /^(?=.*\d)/;
  const specialCharRegex = /^(?=.*[@$!%*?&#])/;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter your Name"),
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your Email"),
    changePassword: Yup.bool(),
    currentPassword: Yup.string().when("changePassword", {
      is: true,
      then: () => Yup.string().required("This field is required!"),
      otherwise: () => Yup.string().nullable(),
    }),
    newPassword: Yup.string().when("changePassword", {
      is: true,
      then: () =>
        Yup.string()
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
      otherwise: () => Yup.string().nullable(),
    }),
    confirmPassword: Yup.string().when("changePassword", {
      is: true,
      then: () =>
        Yup.string()
          .required("Confirm Password Required")
          .oneOf([Yup.ref("newPassword")], "Confirm Password does NOT match New Password"),
      otherwise: () => Yup.string().nullable(),
    }),
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

  const handleSubmit = async (values, {setFieldValue}) => {
    setIsLoading(true);
    try{
      const response = await apiUpdateInfo({name: values.name, email: values.email})
      // console.log("Values in handle Submit: ", values);
      if(isCorrect){
        const responsePassword = await apiUpdatePassword({newPassword: values.newPassword})
      }
      notify(response?.data?.message, true)
      setIsEditable(false);
      setIsCorrect(false);
      // Alternate to reseeting the form
      setFieldValue("name",values.name)
      setFieldValue("email",values.email)
      setFieldValue("role",values.role)
      setFieldValue("designation",values.designation)
      setFieldValue("changePassword",false)
      setFieldValue("currentPassword","")
      setFieldValue("newPassword","")
      setFieldValue("confirmPassword","")
    }catch(error){
      notify(error?.response?.data?.message);
      console.log("Error in UpdatePassword Component: ", error);
      if (error?.response?.data?.status === 401) {
        signOut();
      }
    }
    finally{
      setIsLoading(false);
    }

    
  };

  return (
    <Card className="m-5">
    {isLoading && <Loading />}
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title>
            {" "}
            <h3>Profile</h3>
          </Card.Title>
          <Button
            disabled={isEditable}
            type="button"
            className="btn btn-light"
            onClick={() => {
              setIsEditable(true);
            }}
          >
            <i className="bi bi-pencil-square m-2"></i>
            <span>Edit</span>
          </Button>
        </div>

        <Formik
          enableReinitialize
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
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
                    {/* <!-- Role field --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="role">
                          Role:
                        </label>
                        <Field name="role">
                          {({ field, form }) => {
                            return (
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                placeholder="No role assigned"
                                value={values.role}
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
                      </div>
                    </div>
                    {/* <!-- Designation input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                          Designation:
                        </label>
                        <Field name="email">
                          {({ field, form }) => {
                            return (
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                placeholder="No Designation assigned"
                                value={values.designation}
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change password */}
                {isEditable && (
                  <div className="form-outline mb-4">
                    <Field name="changePassword">
                      {({ field, form }) => {
                        return (
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={values.changePassword}
                              onChange={(event) => {
                                form.setFieldValue(
                                  field.name,
                                  event.target.checked
                                );
                              }}
                            />

                            <label
                              className="form-check-label"
                              htmlFor="form2Example31"
                            >
                              {" "}
                              Change Password{" "}
                            </label>
                          </div>
                        );
                      }}
                    </Field>
                  </div>
                )}
                {(values.changePassword && isEditable) && (
                  <div className="row mb-4">
                    <div className="col-12 col-md-7 text-center">
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
                                autoComplete="new-password"
                                  type={showPassword.current ? "text" : "password"}
                                  className="form-control"
                                  placeholder="*******"
                                  value={values.currentPassword}
                                  onChange={(event) => {
                                    form.setFieldValue(
                                      field.name,
                                      event.target.value
                                    );
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
                                  disabled={!isCorrect}
                                  type={showPassword.new ? "text" : "password"}
                                  className="form-control"
                                  placeholder="*******"
                                  value={values.newPassword}
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
                                  disabled={!isCorrect}
                                  type={showPassword.confirm ? "text" : "password"}
                                  className="form-control"
                                  placeholder="*******"
                                  value={values.confirmPassword}
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
                    </div>
                    <div className="col-12 col-md-5">
                      <Card>
                        <Card.Body>
                          <Card.Header className="text-center">Rules</Card.Header>
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
                         
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                )}

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
                              setFieldValue("changePassword",false);
                              setFieldValue("currentPassword","");
                              setFieldValue("newPassword","");
                              setFieldValue("confirmPassword","");
                              setIsEditable(false);
                              setIsCorrect(false);
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
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default Profile;
