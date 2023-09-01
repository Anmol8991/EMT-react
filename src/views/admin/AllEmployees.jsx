import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EmployeesTable from "../dashboard/admin/components/EmployeesTable";

const AllEmployees = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column gap-4 m-4">
      <div className="d-flex align-items-center justify-content-between">
        <h3> Employees</h3>
        <Button onClick={() => navigate("/admin/addEmployee")}>
          Add Employee
        </Button>
      </div>
      <EmployeesTable />
    </div>
  );
};

export default AllEmployees;
