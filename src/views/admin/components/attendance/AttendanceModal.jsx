import React, {useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { Button } from "react-bootstrap";
import { HiOutlinePencil } from "react-icons/hi";
import DatePicker from "react-datepicker";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import useAuth from "../../../../hooks/useAuth";
import { notify } from "../../../../utils/toastify";
import { apiUpdateRegularize } from "../../../../api/admin.api";


const statusOptions = [
  { value: "approve", label: "Approve" },
  { value: "pending", label: "Pending" },
  { value: "denied", label: "Denied" },
];
const attendanceStatusOptions = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
];
const AttendanceModal = ({ show, initialData, onClose }) => {
  const { signOut } = useAuth()
  const [isEditable, setIsEditable ] = useState(false)

  const validationSchema = Yup.object().shape({
    date: Yup.date().required("This field is required"),
    clockIn: Yup.string().required("start time cannot be empty"),
    clockOut: Yup.string()
    .required("end time cannot be empty")
    .test("is-greater", "end time should be greater", function(value) {
      const { clockIn } = this.parent;
      return moment(value, "hh:mm").isSameOrAfter(moment(clockIn, "hh:mm"));
    }),
  });

  const handleSubmit = async (values, {resetForm}) => {
    console.log("Send Submit request: ", values)
    try{
      const payload = {
        userId: values?.userId,
        id: values?.id, 
        date: values?.date, 
        clockIn: values?.clockIn, 
        clockOut: values?.clockOut,
        status: values?.status
      }
      const response = await apiUpdateRegularize(payload);
      notify(response?.data?.message, true)
      setIsEditable(false);
      onClose();
    }catch(error){
      console.log("Error in AttendanceModal Component: ", error);
        if(error?.response?.data?.status === 401){
          signOut()
        }
      notify(error?.response?.data?.message)
    }
    
  }

  return (
    <Modal size="lg" show={show} onHide={() => {
      setIsEditable(false)
      onClose()}}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body >
      <div className="d-flex justify-content-between m-4 mb-0">
          <h5>Attendance</h5>
          {initialData?.status === 'pending' && (<Button
            disabled={isEditable}
            size="sm"
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditable(!isEditable)}
          >
            <span>Edit</span>
          </Button>)}
        </div>
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
                                disabled
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
                                disabled
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
                                disabled
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
                    {/* <!-- Attendance Status input --> */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                         Attendance Status:
                        </label>
                        <Field name="attendanceStatus">
                          {({ field, form }) => {
                            return (
                              <Select
                              isDisabled
                              field={field}
                              form={form}
                              className="basic-single"
                              placeholder="Select Attendance Status"
                              // name="leaveType"
                              options={attendanceStatusOptions}
                              value={attendanceStatusOptions.filter(
                                (option) => option.value === values.attendanceStatus
                              )}
                              onChange={(option) =>
                                form.setFieldValue(field.name, option?.value)
                              }
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
                    {/* Status */}
                    <div className="col">
                      <div className="form-outline mb-4 text-start">
                        <label className="form-label" htmlFor="email">
                        Status:
                        </label>
                        <Field name="status">
                          {({ field, form }) => {
                            return (
                              <Select
                              isDisabled={!isEditable}
                              field={field}
                              form={form}
                              className="basic-single"
                              placeholder="Select Status"
                              // name="leaveType"
                              options={statusOptions}
                              value={statusOptions.filter(
                                (option) => option.value === values.status
                              )}
                              onChange={(option) =>
                                form.setFieldValue(field.name, option?.value)
                              }
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
                              setIsEditable(!isEditable)
                              // handleCancel()
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
    </Modal.Body>
    </Modal>
  );
};

AttendanceModal.defaultProps = {
    show: false,
    initialData: {
        date: "",
        clockIn: "",
        clockOut: "",
        time: "",
        attendanceStatus: "",
        status: "pending",
    },

  };
export default AttendanceModal;

