import { useState, useEffect, useRef } from "react";
import { useUserContext } from "../../../hooks/useUserContext";
import Loading from "../../../components/loader/Loading";
import TotalEmployees from "./components/TotalEmployees";
import AvailableToday from "./components/AvailableToday";
import EmployeesTable from "./components/EmployeesTable";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserContext();

  return (
    <>
      {isLoading && <Loading />}
      <div className="container-fluid mt-2">
        <div className="row">
          <div className="col ">
            <h3>Hello {user.name} !</h3>
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </div>
        <div className="row row-cols-sm-2 mb-4">
          <div className="col-12 mb-4 col-sm-6 mb-sm-0">
            <TotalEmployees />
          </div>
          <div className="col-12 mb-4 col-sm-6 mb-sm-0">
            <AvailableToday />
          </div>
        </div>

        <div className="row row-cols-1">
          <div className="col">
            <EmployeesTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
