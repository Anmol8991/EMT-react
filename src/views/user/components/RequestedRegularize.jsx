import {useState, useEffect} from 'react'
import { Card, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import DataTables from '../../../components/DataTables';
import {
  HiOutlineEye,
  HiOutlineMinusCircle,
  HiOutlineMenuAlt4,
  HiOutlinePencil
} from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import { apiRequestedRegularized, apiUpdateRegularize, apiDeleteRegularize } from '../../../api/user.api';
import useAuth from '../../../hooks/useAuth';
import RegularizeForm from './ReqularizeForm';
import { notify } from '../../../utils/toastify';
import Swal from 'sweetalert2'


const RequestedRegularize = () => {
    const {signOut} = useAuth()
    const [data, setData ] = useState([])
    const [modalData, setModalData] = useState({})
    const [show, setShow] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    useEffect(()=>{
    const controller = new AbortController()

    const fetchData =  async () => {
        try{
        const response = await apiRequestedRegularized({signal: controller.signal})
        const newObj = response?.data?.data
        newObj.date = 
        setData(response?.data?.data)
    }catch(error){
        if(error?.name !== "CanceledError"){
        console.log("Error in RequestedRegularize Component: ", error);
        if(error?.response?.data?.status === 401){
            signOut()
        }
        }else{
        console.log("Request Aborted!")
        }
    }
    }
    fetchData()

    return ()=> {
        controller.abort()
    }
    },[show])

    const handleDelete = async (id) => {
        try{
          const response = await apiDeleteRegularize({id})
          notify(response?.data?.message, true)
          setData(data.filter((item) => item?.id !== id))
        }catch(error){
          console.log("Error in Requested Regularize Component: ", error);
            if(error?.response?.data?.status === 401){
              signOut()
            }
        }
    
      } 
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
                console.log("Clicked View: ", row);
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
                    date: newDate,
                    clockIn: row?.clockIn,
                    clockOut: row?.clockOut,
                    time: durationHours,
                    status: row?.status
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

            { row?.status === "pending" && (<Dropdown.Item
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
            </Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  const handleCancel = ()=>{
    setIsEditable(false)
  }

  const handleSave = async (values, {resetForm}) => {
    console.log("Values in handle Submit: ", values);
    try{
        const response = await apiUpdateRegularize(values)
        notify(response?.data?.message, true)
        setIsEditable(false)
        setShow(false)
    }catch(error){
        console.log("Error in Requested Regularize Component: ", error);
        if(error?.response?.data?.status === 401){
            signOut()
        }else if(error?.response?.data?.status === 500){
            notify(error?.response?.data?.message)
        }
    }finally{
        resetForm()
    }
  }

  return (
    <>
    <Card className="m-5">
      <Card.Header>
        {" "}
        <h4> Requested </h4>
      </Card.Header>
      <Card.Body>
        <DataTables columns={columns} tableData={data}></DataTables>
      </Card.Body>
    </Card>
    <Modal size="lg" show={show} onHide={()=> {
      setIsEditable(false)
      setShow(false)
      }}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body >
      <div className="d-flex justify-content-between m-4 mb-0">
          <h5>Attendance</h5>
          
          { modalData?.status === 'pending' &&(<Button
            disabled={isEditable}
            size="sm"
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditable(!isEditable)}
          >
            <span>Edit</span>
          </Button>)}
        </div>
        <RegularizeForm isEditable={isEditable} initialData={modalData} handleCancel={handleCancel} handleSave={handleSave}/>
    </Modal.Body>
    </Modal>
    </>
  )
}

export default RequestedRegularize