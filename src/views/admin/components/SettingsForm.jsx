import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import Select from "react-select";

let salaryCycleOptions = [];
for (let i = 1; i <= 28; i++) {
  salaryCycleOptions.push({ value: i, label: i });
}

const SettingsForm = ({
    initialData,
    isEditable,
    handleCancel,
    handleSave,
  }) => {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Please enter Name"),
      workingHours: Yup.number().required("This field is required!"),
      paidLeavePolicy: Yup.number().required("This field is required!"),
      casualLeavePolicy: Yup.number().required("This field is required!"),
      sickLeavePolicy: Yup.number().required("This field is required!"),
      salaryCycle: Yup.number().required("This field is required!"),
    });
    // console.log("Prop Value: ",initialData)
  
    return (
      <Formik
        enableReinitialize
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ values, resetForm }) => {
            // console.log("Form Value: ", values)
            return (
                <Form>
                  <div className="form-outer bg-white p-4">
                    <div className="container">
                      <div className="row row-cols-1 row-cols-md-2">
                        {/* <!-- Name input --> */}
                        <div className="col">
                          <div className="form-outline mb-4 text-start">
                            <label className="form-label" htmlFor="name">
                              Company Name:
                            </label>
                            <Field name="name">
                              {({ field, form }) => {
                                return (
                                  <input
                                    disabled
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
                        {/* <!-- workingHours field --> */}
                        <div className="col">
                          <div className="form-outline mb-4 text-start">
                            <label className="form-label" htmlFor="role">
                              Working Hours / day:
                            </label>
                            <Field name="workingHours">
                              {({ field, form }) => {
                                return (
                                  <input
                                    disabled={!isEditable}
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Number of Hours"
                                    value={values.workingHours}
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
                            <ErrorMessage name="workingHours">
                              {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                  {msg}
                                </p>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                        {/* <!-- paidLeavePolicy input --> */}
                        <div className="col">
                          <div className="form-outline mb-4 text-start">
                            <label className="form-label" htmlFor="email">
                              Paid Leave Policy/month:
                            </label>
                            <Field name="paidLeavePolicy">
                              {({ field, form }) => {
                                return (
                                  <input
                                    disabled={!isEditable}
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Paid Leave Policy"
                                    value={values.paidLeavePolicy}
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
                            <ErrorMessage name="paidLeavePolicy">
                              {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                  {msg}
                                </p>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                        {/* <!-- casualLeavePolicy input --> */}
                        <div className="col">
                          <div className="form-outline mb-4 text-start">
                            <label className="form-label" htmlFor="email">
                              Casual Leave Policy/month:
                            </label>
                            <Field name="casualLeavePolicy">
                              {({ field, form }) => {
                                return (
                                  <input
                                    disabled={!isEditable}
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Paid Leave Policy"
                                    value={values.casualLeavePolicy}
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
                            <ErrorMessage name="casualLeavePolicy">
                              {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                  {msg}
                                </p>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
        
                        {/* <!-- sickLeavePolicy input --> */}
                        <div className="col">
                          <div className="form-outline mb-4 text-start">
                            <label className="form-label" htmlFor="email">
                              Sick Leave Policy/month:
                            </label>
                            <Field name="sickLeavePolicy">
                              {({ field, form }) => {
                                return (
                                  <input
                                    disabled={!isEditable}
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Sick Leave Policy"
                                    value={values.sickLeavePolicy}
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
                            <ErrorMessage name="sickLeavePolicy">
                              {(msg) => (
                                <p className="text-start" style={{ color: "red" }}>
                                  {msg}
                                </p>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
        
                        {/* <!-- Salary Cycle input --> */}
                        <div className="col">
                          <div className="form-outline mb-4 text-start">
                            <label className="form-label" htmlFor="email">
                              Salary Cycle:
                            </label>
                            <Field name="salaryCycle">
                              {({ field, form }) => {
                                return (
                                  <Select
                                    isDisabled={!isEditable}
                                    field={field}
                                    form={form}
                                    className="basic-single"
                                    placeholder="Select Cycle"
                                    // name="leaveType"
                                    options={salaryCycleOptions}
                                    value={salaryCycleOptions.filter(
                                      (option) => option.value === values.salaryCycle
                                    )}
                                    onChange={(option) =>
                                      form.setFieldValue(field.name, option?.value)
                                    }
                                  />
                                );
                              }}
                            </Field>
                            <ErrorMessage name="salaryCycle">
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
              )
        }}
      </Formik>
    );
  };

export default SettingsForm