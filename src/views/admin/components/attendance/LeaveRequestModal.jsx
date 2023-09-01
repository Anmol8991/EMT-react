import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { HiOutlinePencil } from "react-icons/hi";
import useAuth from "../../../../hooks/useAuth";
import { notify } from "../../../../utils/toastify";
import { apiUpdateLeave } from "../../../../api/admin.api";

const leaveTypeOptions = [
    { value: "paid", label: "Paid" },
    { value: "casual", label: "Casual" },
    { value: "sick", label: "Sick" },
    { value: "unpaid", label: "Unpaid" },
  ];
const statusOptions = [
  { value: "approve", label: "Approve" },
  { value: "pending", label: "Pending" },
  { value: "denied", label: "Denied" },
];
const LeaveRequestModal = ({ show, initialData, onClose }) => {
    const { signOut } = useAuth();
    const [isEditable, setIsEditable ] = useState(false)

    const validationSchema = Yup.object().shape({
        leaveType: Yup.string().required("Please Select Type"),
        startDate: Yup.date().required("Please Select Date"),
        endDate: Yup.date().required("Please Select Date"),
        appliedLeaves: Yup.number().required("Please enter a whole number"),
        status: Yup.string().required("Please Select Status"),
      });

    const handleSubmit = async (values, {resetForm}) => {
        console.log("Send Submit request: ", values)
    try{
      const payload = {
        userId: values?.userId,
        id: values?.id, 
        leaveType: values?.leaveType, 
        availableLeaves: values?.availableLeaves, 
        appliedLeaves: values?.appliedLeaves,
        status: values?.status
      }
      const response = await apiUpdateLeave(payload);
      notify(response?.data?.message, true)
      setIsEditable(false);
      onClose();
    }catch(error){
      console.log("Error in LeaveRequestModal Component: ", error);
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
          <h5>Leave Requests</h5>
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
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, resetForm }) => (
        <Form>
          <div className="form-outer bg-white p-4">
            <div className="container">
              <div className="row row-cols-1 row-cols-md-2">
                {/* <!-- leaveType input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label" htmlFor="name">
                      Leave Type:
                    </label>
                    <Field name="leaveType">
                      {({ field, form }) => {
                        return (
                          <Select
                              isDisabled
                              field={field}
                              form={form}
                              className="basic-single"
                              placeholder="Select Attendance Status"
                              // name="leaveleaveType"
                              options={leaveTypeOptions}
                              value={leaveTypeOptions.filter(
                                (option) => option.value === values.leaveType
                              )}
                              onChange={(option) =>
                                form.setFieldValue(field.name, option?.value)
                              }
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
                {/* <!-- appliedLeaves input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label">
                      Applied Leaves:
                    </label>
                    <Field name="appliedLeaves">
                      {({ field, form }) => {
                        return (
                          <input
                            disabled
                            leaveType="number"
                            className="form-control"
                            placeholder="Enter Hours Worked"
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
                {/* <!-- Start Date input --> */}
                <div className="col">
                  <div className="form-outline mb-4 text-start">
                    <label className="form-label" htmlFor="name">
                    Start Date:
                    </label>
                    <Field name="startDate">
                      {({ field, form }) => {
                        return (
                          <input
                            disabled
                            type="text"
                            className="form-control"
                            placeholder="Enter Type"
                            value={values.startDate}
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
                    <label className="form-label" htmlFor="name">
                    End Date:
                    </label>
                    <Field name="endDate">
                      {({ field, form }) => {
                        return (
                          <input
                            disabled
                            type="text"
                            className="form-control"
                            placeholder="Enter Type"
                            value={values.endDate}
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
                    <ErrorMessage name="status">
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
                          onClose();
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
              </div>)}
          </div>
        </Form>
      )}
    </Formik>
    </Modal.Body>
    </Modal>
  );
};

LeaveRequestModal.defaultProps = {
    initialData: {
        type: "",
      startDate: "",
      endDate: "",
      days: "",
      status: "",
      },
  };
export default LeaveRequestModal;