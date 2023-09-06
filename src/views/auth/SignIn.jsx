import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import { apiLogin, apiGoogleLogin } from "../../api/auth.api";
import { notify } from "../../utils/toastify";
import * as jose from "jose";
import Loading from "../../components/loader/Loading";
import useAuth from "../../hooks/useAuth.js";
import { GoogleLogin } from "@react-oauth/google";



const SignIn = () => {
  const { signIn } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your user name"),
    password: Yup.string().required("Please enter your password"),
  });

  const handleSubmit = (values) => {
    setIsLoading(true);
    // console.log("Form values in Sign-in Form: ", values);
    const credentials = {
      email: values.email,
      password: values.password,
    };
    apiLogin(credentials)
      .then((response) => {
        signIn(response?.data?.data);
      })
      .catch((error) => {
        notify(error?.response?.data?.message);
        // localStorage.removeItem("token");
        console.log("Error in SignIn Component: ", error);
      })
      .finally(() => setIsLoading(false));
  };

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    console.log(credentialResponse);
    console.log(jose.decodeJwt(credentialResponse.credential))
    try{
      const response = await apiGoogleLogin({idToken: credentialResponse.credential})
      signIn(response?.data?.data)
    }catch(error){
      console.log("Error in SignIn Component: ",error);
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <div
        className="container d-flex align-items-center vh-100"
        style={{ maxWidth: "540px" }}
      >
        <div className="row row-cols-1 justify-content-center">
          <div className="col">
            <h2 className="text-center mb-3">Sign in to your Account</h2>
          </div>
          <div className="col">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, touched, errors, resetForm }) => (
                <Form>
                  <div className="form-outer bg-white p-4 border">
                    {/* <!-- Email input --> */}
                    <div className="form-outline mb-4 text-start">
                      <label className="form-label" htmlFor="email">
                        Email address
                      </label>
                      <Field name="email">
                        {({ field, form }) => {
                          return (
                            <input
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
                    {/* <!-- Password input --> */}
                    <div className="form-outline mb-4 text-start">
                      <label className="form-label" htmlFor="email">
                        Password
                      </label>
                      <div className="input-group">
                        <Field name="password">
                          {({ field, form }) => {
                            return (
                              <input
                                type={showPassword ? "text" : "password"}
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
                        <button
                          id="toggle-password"
                          type="button"
                          className="btn border"
                          onClick={handleShowPassword}
                          aria-label="Show password as plain text. Warning: this will display your password on the screen."
                        >
                          {showPassword ? (
                            <i className="bi bi-eye-fill" id="show_eye"></i>
                          ) : (
                            <i
                              className="bi bi-eye-slash-fill"
                              id="hide_eye"
                            ></i>
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => (
                          <p className="text-start" style={{ color: "red" }}>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                    {/* Remember me and forgot password */}
                    <div className="form-outline d-flex justify-content-around mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={isChecked}
                          id="form2Example31"
                          onChange={(event) => {
                            setIsChecked(event.target.checked);
                          }}
                        />

                        <label
                          className="form-check-label"
                          htmlFor="form2Example31"
                        >
                          {" "}
                          Remember me{" "}
                        </label>
                      </div>
                      <a href="#!">Forgot password?</a>
                    </div>

                    {/* <!-- Submit button --> */}
                    <div className="d-flex">
                      <Button type="submit" className="mb-4 flex-grow-1">
                        Sign-in
                      </Button>
                    </div>
                    {/* <!-- Social Login Buttons --> */}
                    <p className="text-center">or sign in with:</p>
                    <div className="d-flex justify-content-center gap-4 ">
                    <GoogleLogin
                      size="large"
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                          console.log("Login Failed");
                        }}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
