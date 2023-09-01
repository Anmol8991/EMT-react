import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import {
  HiOutlineEye,
  HiOutlineMinusCircle,
  HiOutlineMenuAlt4,
} from "react-icons/hi";
import DataTables from "../../../../components/DataTables";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from 'sweetalert2'
import useAuth from "../../../../hooks/useAuth"
import {notify} from "../../../../utils/toastify"
import {apiGetEmployees, apiDeleteEmployee} from "../../../../api/admin.api.js"

const EmployeesTable = () => {

    const { signOut } = useAuth();
    const [data, setData] = useState([
      { id: "",
        name: "",
        designation: "",
        date_of_joining: "",
        salary: "",
      },
    ])
    const navigate = useNavigate()

    useEffect(() => {
      const controller = new AbortController();
      const fetchData = async () => {
        try{
          const response = await apiGetEmployees({ signal: controller.signal })
          setData(response?.data?.data)
        
        }catch(error){
          // notify(error?.response?.data?.message);
          if(error?.name !== "CanceledError"){
            console.log("Error in EmployeesTable Component: ", error);
            if(error?.response?.data?.status === 401){
              signOut()
            }
          }else{
            console.log("Request Aborted!")
          }
          
        }
        
      }
      fetchData()

      return () => {
        controller.abort()
      }

    }, [])

  const handleDelete = async (id) => {
    
    try{
      const response = await apiDeleteEmployee({id})
      notify(response?.data?.message, true)
      setData(data.filter((item) => item?.id !== id))
    }catch(error){
      if(error?.name !== "CanceledError"){
        console.log("Error in EmployeesTable Component: ", error);
        if(error?.response?.data?.status === 401){
          signOut()
        }
      }else{
        console.log("Request Aborted!")
      }
    }

  }  

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
    },
    {
      name: "Date of Joining",
      selector: (row) => row.dateOfJoining,
    },
    {
      name: "Salary",
      selector: (row) => row.salary,
    },
    {
      name: "Action",
      cell: (row) => (
        <Dropdown drop="end">
          <Dropdown.Toggle variant="secondary" size='sm'>
            <HiOutlineMenuAlt4 />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                navigate(`/admin/employeeDetails/${row?.id}`)
              }}
            >
              <span className="flex items-center gap-1 text-blue-600">
                <HiOutlineEye className="text-xl" />
                View
              </span>
            </Dropdown.Item>

            <Dropdown.Item
            onClick={() => {
              Swal.fire(
                  {
                      title: 'Delete',
                      text: `Are you sure you want to delete?`,
                      icon: 'warning',
                      confirmButtonText:
                          'Delete',
                      showCancelButton:
                          true,
                  }
              ).then(
                  (result) => {
                      if (result.isConfirmed) {
                          handleDelete(row?.id)
                      }
                  }
              )
          }}>
              <span className="flex items-center gap-1 text-amber-600">
                <HiOutlineMinusCircle className="text-xl" />
                Delete
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];
  
  return (
    <Card>
      <Card.Header>
        {" "}
        <h4> Existing Employees </h4>
      </Card.Header>
      <Card.Body>
        <DataTables columns={columns} tableData={data}></DataTables>
        
      </Card.Body>
    </Card>
  );
};

export default EmployeesTable;
