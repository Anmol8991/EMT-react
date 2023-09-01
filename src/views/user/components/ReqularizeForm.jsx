import React,{ useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Card, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";


const RegularizeForm = ({isEditable, initialData, handleCancel, handleSave}) => {
    const [isLoading, setIsLoading] = useState(false);
 
  const validationSchema = Yup.object().shape({
    date: Yup.date().required("This field is required").max(new Date(), "Date must be less than today"),
    clockIn: Yup.string().required("start time cannot be empty"),
    clockOut: Yup.string()
    .required("end time cannot be empty")
    .test("is-greater", "end time should be greater", function(value) {
      const { clockIn } = this.parent;
      return moment(value, "hh:mm").isSameOrAfter(moment(clockIn, "hh:mm"));
    }),
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
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <div className="form-outer bg-white p-4">
                <div className="container">
                  <div className="row row-cols-1 row-cols-md-2">
                    {/* <!-- Date input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                          Date:
                        </label>
                        <Field name="date">
                          {({ field, form }) => {
                            return (
                              <DatePicker
                                disabled={!isEditable}
                                className="form-control"
                                placeholder="Select Start Date"
                                selected={values.date}
                                onChange={(date) => {
                                  form.setFieldValue(
                                    field.name,
                                    date
                                  );
                                }}
                              />
                            );
                          }}
                        </Field>
                        <ErrorMessage name="date">
                          {(msg) => (
                            <p className="text-start" style={{ color: "red" }}>
                              {msg}
                            </p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    {/* <!-- ClockIn Type input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="name">
                          Clock In Time:
                        </label>
                        <Field name="clockIn">
                          {({ field, form }) => {
                            return (
                                <input 
                                disabled={!isEditable}
                                type="time" 
                                className="form-control" 
                                value={values.clockIn}
                                onChange={(event) => {
                                    
                                  form.setFieldValue(
                                    field.name,
                                    event.target.value
                                  );
                                  console.log("Clock In: ", event.target.value)
                                  const startTime = moment(event.target.value, "hh:mm");
                                  const endTime = moment(values.clockOut, "hh:mm");

                                  const durationHours = (endTime.diff(startTime, 'hours') + (endTime.diff(startTime, 'minutes') % 60) / 60).toFixed(2);

                                  setFieldValue("time",durationHours )
                                }}/>
                            );
                          }}
                        </Field>
                        <ErrorMessage name="clockIn">
                          {(msg) => (
                            <p className="text-start" style={{ color: "red" }}>
                              {msg}
                            </p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    {/* <!-- ClockOut Leaves field --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="name">
                          Clock Out Time:
                        </label>
                        <Field name="clockOut">
                          {({ field, form }) => {
                            return (
                                <input 
                                disabled={!isEditable}
                                type="time" 
                                className="form-control" 
                                value={values.clockOut}
                                onChange={(event) => {
                                  form.setFieldValue(
                                    field.name,
                                    event.target.value
                                  );
                                  console.log("Clock Out: ", event.target.value)
                                  const startTime = moment(values.clockIn, "hh:mm");
                                  const endTime = moment(event.target.value, "hh:mm");

                                  const durationHours = (endTime.diff(startTime, 'hours') + (endTime.diff(startTime, 'minutes') % 60) / 60).toFixed(2);

                                  setFieldValue("time",durationHours )
                                }}/>
                            );
                          }}
                        </Field>
                        <ErrorMessage name="clockOut">
                          {(msg) => (
                            <p className="text-start" style={{ color: "red" }}>
                              {msg}
                            </p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    
                    {/* <!-- Time input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                         Time:
                        </label>
                        <Field name="time">
                          {({ field, form }) => {
                            return (
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                placeholder="Time in Hours"
                                value={values.time}
                              />
                            );
                          }}
                        </Field>
                        <ErrorMessage name="time">
                          {(msg) => (
                            <p className="text-start" style={{ color: "red" }}>
                              {msg}
                            </p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                  </div>
                  {/* Cancel and Save Button */}
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

RegularizeForm.defaultProps = {
    isEditable: true,
    initialData: {
        date: "",
        clockIn: "",
        clockOut: "",
        time: "",
    },
    handleCancel: () => console.log("pressed Cancel"),
    handleSave: (values) => console.log("Values in handleSubmit: ", values)
}

export default RegularizeForm;