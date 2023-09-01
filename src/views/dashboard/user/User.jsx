import {useState, useEffect, useRef} from 'react'
import { useUserContext } from "../../../hooks/useUserContext";
import Loading from '../../../components/loader/Loading';
import Post from './components/Post';
import Timer from './components/Timer';
import Attendance from './components/Attendance';
import AvailableLeaves from './components/AvailableLeaves';

const User = () => {
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
        <div className="col-12 mb-4 col-sm-7 mb-sm-0 col-md-8">
          <Post />
        </div>
        <div className="col-12 mb-4 col-sm-5 mb-sm-0 col-md-4">
          <Timer/>
        </div>

      </div>

      <div className="row row-cols-sm-2">
        <div className="col-12 mb-4 mb-md-0 col-md-6">
          <Attendance />
        </div>
        <div className="col-12 mb-4 mb-md-0 col-md-6">
          <AvailableLeaves />
        </div>

      </div>


      
    </div>
    </>
  )
}

export default User
