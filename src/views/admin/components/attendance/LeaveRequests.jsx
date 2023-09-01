import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "react-bootstrap";
import {
  HiOutlineEye,
  HiOutlineMinusCircle,
  HiOutlineMenuAlt4,
} from "react-icons/hi";
import DataTables from "../../../../components/DataTables";
import Dropdown from "react-bootstrap/Dropdown";
import LeaveRequestModal from "./LeaveRequestModal";

const LeaveRequests = ({data}) => {
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const columns = [
    {
        name: "Type",
        selector: (row) => {
        if(row.leaveType === 'paid'){
          return "Paid"
        }else if( row.leaveType === 'casual'){
          return "Casual"
        }else if( row.leaveType === 'sick'){
          return "Sick"
        }else{
          return "Unpaid"
        } 
        },
      },
    {
        name: "Start Date",
        selector: (row) => row.startDate,
    },
    {
        name: "End Date",
        selector: (row) => row.endDate,
      },
    {
      name: "Days",
      selector: (row) => row.appliedLeaves,
    },
    {
      name: "Status",
      selector: (row) => {
        if (row.status === "pending") {
          return "Pending";
        } else if (row.status === "approve") {
          return "Approved";
        } else {
          return "Denied";
        }
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Dropdown drop="end">
          <Dropdown.Toggle variant="secondary" size="sm">
            <HiOutlineMenuAlt4 />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                console.log("Clicked View: ", row);
                setModalData(row);
                handleShow();
              }}
            >
              <span className="flex items-center gap-1 text-blue-600">
                <HiOutlineEye className="text-xl" />
                View
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
        <h4>Employee Leave Requests </h4>
      </Card.Header>
      <Card.Body>
        <DataTables columns={columns} tableData={data}></DataTables>
        <LeaveRequestModal
          show={show}
          initialData={modalData}
          onClose={handleClose}
        />
      </Card.Body>
    </Card>
  );
};

export default LeaveRequests;