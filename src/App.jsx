import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import Layouts from './components/layouts/Layouts';
import './App.css'
import Swal from "sweetalert2";

function App() {
  const [firstTimeAlert, setFirstTimeAlert] = useState(true)

  useEffect(()=>{
    if(firstTimeAlert){
      Swal.fire({
        title: "Login Account Details",
        html: `
            <div>
              <p>Admin </p>
              <p>Email: john@example.com</p>
              <p>Password: password123</p>
              <p>Employee</p>
              <p>Email: anmolarora98@gmail.com </p>
              <p>Password: Anmol#123</p>
            </div>`,
        icon: "success",
        confirmButtonText: "OK",
        showCancelButton: false,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Alert Read!");
          setFirstTimeAlert(false)
        }
      });
    }
    
  },[])

  return (
    <BrowserRouter>
      <ToastContainer />
      <Layouts />
    </BrowserRouter>
  )
}

export default App
