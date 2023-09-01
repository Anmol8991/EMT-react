import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import AttendanceModal from "./AttendanceModal";
import {
  HiOutlineEye,
  HiOutlineMinusCircle,
  HiOutlineMenuAlt4,
} from "react-icons/hi";
import DataTables from "../../../../components/DataTables";
import Dropdown from "react-bootstrap/Dropdown";


const AttendanceTable = ({ data }) => {
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState();

  const handleClose = () => setShow(false);
  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "Clock In Time",
      selector: (row) => row.clockIn,
    },
    {
      name: "Clock Out Time",
      selector: (row) => row.clockOut,
    },
    {
        name: "Attendance Status",
        selector: (row) => {
          if (row.attendanceStatus === "present") {
            return "Present";
          } else if (row.attendanceStatus === "absent") {
            return "Absent";
          } 
        },
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
          <Dropdown.Toggle variant="secondary">
            <HiOutlineMenuAlt4 />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                console.log("Clicked View");
                const startTime = moment(row?.clockIn, "hh:mm");
                const endTime = moment(row?.clockOut, "hh:mm");

                const durationHours = (endTime.diff(startTime, 'hours') + (endTime.diff(startTime, 'minutes') % 60) / 60).toFixed(2);
                // Convert the string date to a Date object
                const originalDate = new Date(row?.date);

                // Set the time to noon (12:00:00)
                originalDate.setHours(12, 0, 0, 0);

                // Add one day to the date
                const newDate = new Date(originalDate);
                newDate.setDate(originalDate.getDate() + 1);
                const newObj = {
                    id: row?.id,
                    userId: row?.userId,
                    date: newDate,
                    clockIn: row?.clockIn,
                    clockOut: row?.clockOut,
                    time: durationHours,
                    attendanceStatus: row?.attendanceStatus,
                    status: row?.status,
                }
                setModalData(newObj)
                setShow(true)
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
        <h4> Employee Attendance Regularize Requests</h4>
      </Card.Header>
      <Card.Body>
        <DataTables columns={columns} tableData={data}></DataTables>
        <AttendanceModal
          show={show}
          initialData={modalData}
          onClose={handleClose}
        />
      </Card.Body>
    </Card>
  );
};

export default AttendanceTable;
