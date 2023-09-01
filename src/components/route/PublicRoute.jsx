import {  Outlet, Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const PublicRoute = () => {
    const { authenticated } = useAuth()


    return authenticated ? <Navigate to="/profile" /> : <Outlet />

}

export default PublicRoute