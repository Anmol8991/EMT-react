import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import Layouts from './components/layouts/Layouts';
import './App.css'

function App() {


  return (
    <BrowserRouter>
      <ToastContainer />
      <Layouts />
    </BrowserRouter>
  )
}

export default App
