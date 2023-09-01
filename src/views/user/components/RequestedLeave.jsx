import React, {useState, useEffect } from 'react'
import { Card, Button } from "react-bootstrap";
import DataTables from '../../../components/DataTables';
import {
  HiOutlineEye,
  HiOutlineMinusCircle,
  HiOutlineMenuAlt4,
  HiOutlinePencil
} from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import useAuth from '../../../hooks/useAuth';
import { apiGetLeaves, apiUpdateLeaves, apiDeleteLeaves } from '../../../api/user.api';
import Modal from "react-bootstrap/Modal";
import ApplyLeaveForm from './ApplyLeaveForm';
import { notify } from '../../../utils/toastify';
import Swal from 'sweetalert2'


const RequestedLeave = () => {
  const {signOut} = useAuth()
  const [ data, setData ] = useState([
    { id: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      appliedLeaves: "",
      status: ""
  }
  ])
  const [modalData, setModalData] = useState({})
  const [show, setShow] = useState(false)
  const [isEditable, setIsEditable] = useState(false)

  useEffect(()=>{
  const controller = new AbortController()

  const fetchData =  async () => {
    try{
      const response = await apiGetLeaves({signal: controller.signal})
      setData(response?.data?.data)

  }catch(error){
    if(error?.name !== "CanceledError"){
      console.log("Error in Requested Leave Component: ", error);
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

  const columns = [
    {
      name: "Leave Type",
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
      name: "Number of Days",
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
          <Dropdown.Toggle variant="secondary">
            <HiOutlineMenuAlt4 />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                const newObj = {...row}
                const originalDate = new Date(row?.startDate);
                const originalDate2 = new Date(row?.endDate);

                // Set the time to noon (12:00:00)
                originalDate.setHours(12, 0, 0, 0);
                originalDate2.setHours(12, 0, 0, 0);

                // Add one day to the date
                const newStartDate = new Date(originalDate);
                newStartDate.setDate(originalDate.getDate() + 1);

                const newEndDate = new Date(originalDate2);
                newEndDate.setDate(originalDate2.getDate() + 1);

                newObj.startDate = newStartDate, 
                newObj.endDate = newEndDate, 
                newObj.availableLeaves = parseInt(row?.availableLeaves),
                newObj.appliedLeaves = parseInt(row?.appliedLeaves),
                console.log("newObj on clicking view: ",newObj)
                setModalData(newObj)
                setShow(true)
              }}
            >
              <span className="flex items-center gap-1 text-blue-600">
                <HiOutlineEye className="text-xl" />
                View
              </span>
            </Dropdown.Item>

            { row?.status === 'pending' &&(<Dropdown.Item
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

  const handleDelete = async (id) => {
    try{
      const response = await apiDeleteLeaves({id})
      notify(response?.data?.message, true)
      setData(data.filter((item) => item?.id !== id))
    }catch(error){
      console.log("Error in RequestedLeave Component: ", error);
        if(error?.response?.data?.status === 401){
          signOut()
        }
    }

  } 
  const handleCancel = ()=>{
    setIsEditable(false)
  }

  const handleSave = async (values, {resetForm}) => {
    console.log("Values in handle Save: ", values);
    try{
      const payload = { 
        id: values?.id, 
        leaveType: values?.leaveType , 
        startDate: values?.startDate, 
        endDate: values?.endDate,
        appliedLeaves: values?.appliedLeaves  
      }
        const response = await apiUpdateLeaves(payload)
        notify(response?.data?.message, true)
        setShow(false);
        setIsEditable(false);
    }catch(error){
        console.log("Error in Requested Leave Component: ", error);
        if(error?.response?.data?.status === 401){
            signOut()
        }else if(error?.response?.data?.status === 500){
            notify(error?.response?.data?.message)
        }
    }
  }

  return (
    <>
    <Card className="m-5">
      <Card.Header>
        {" "}
        <h4> Requested Leaves </h4>
      </Card.Header>
      <Card.Body>
        <DataTables columns={columns} tableData={data}></DataTables>
      </Card.Body>
    </Card>
    <Modal size="lg" show={show} onHide={()=> {
      setIsEditable(false)
      setShow(false)}}>
    <Modal.Header closeButton>
    </Modal.Header>
    <Modal.Body >
    <div className="d-flex justify-content-between m-4 mb-0">
        <h5>Attendance</h5>
        {modalData?.status === 'pending' &&(<Button
          disabled={isEditable}
          size="sm"
          icon={<HiOutlinePencil />}
          onClick={() => setIsEditable(!isEditable)}
        >
          <span>Edit</span>
        </Button>)}
      </div>
      <ApplyLeaveForm isEditable={isEditable} initialData={modalData} handleCancel={handleCancel} handleSave={handleSave}/>
  </Modal.Body>
  </Modal>
    </>
  )
}

export default RequestedLeave
