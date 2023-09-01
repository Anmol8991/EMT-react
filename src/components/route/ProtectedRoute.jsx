import {  Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth'

const ProtectedRoute = () => {
    const { authenticated } = useAuth()

    if(!authenticated){
        // User is not logged in or Token has expired or Invalid Token
        console.log("In Protected Route msg: User Logged Outso navigate to sign-in!")
        return <Navigate to='/sign-in'/>
    }
    
    return <Outlet />
}

export default ProtectedRoute
