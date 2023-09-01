import { Card } from "react-bootstrap";
import EmployeeDetailForm from "./EmployeeDetailForm";
import { apiAddEmployee } from "../../../../api/admin.api";
import { notify } from "../../../../utils/toastify";
import useAuth from "../../../../hooks/useAuth";
import Swal from "sweetalert2";

const AddEmployee = () => {
  const { signOut } = useAuth();

  const handleSave = async (formData, { resetForm }) => {
    formData.salary = JSON.stringify([
      {
        CTC: 1200000,
        hra: 300000,
        Basic: 600000,
        travel: 60000,
        medical: 60000,
        special: 46800,
        incentive: 60000,
        company_insurance: 30000,
        pf_employee_contribution: 21600,
        pf_employer_contribution: 21600,
      },
    ]);
    // console.log("Form Data in AddEmployee: ", formData);
    try {
      const response = await apiAddEmployee(formData);
      // console.log("Response of AddEmployee request: ", response?.data?.data);
      notify(response?.data?.message, true);

      Swal.fire({
        title: "Added Successfully!",
        html: `
            <div>
              <p><strong>Initial Login Account Details:</strong></p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Password:</strong> ${formData.password}</p>
              <p>Note: Update password after initial login</p>
            </div>`,
        icon: "success",
        confirmButtonText: "OK",
        showCancelButton: false,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Alert");
        }
      });

      resetForm()
    } catch (error) {
      notify(error?.response?.data?.message);
      console.log("Error in AddEmployee Component: ", error);
      if (error?.response?.data?.status === 401) {
        signOut();
      }
    }
  };

  return (
    <Card className="m-4">
      <div className="d-flex flex-column">
        <h5 className="m-4">Add Employee</h5>
        <EmployeeDetailForm handleSave={handleSave} />
      </div>
    </Card>
  );
};

export default AddEmployee;
