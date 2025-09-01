import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const DoctorProtectedRoute = ({children}) => {
    const { isAuthenticated } = useSelector((state) => state.doctorAuth)
     
    if(!isAuthenticated)
    {
        return <Navigate to="/doctor/login" replace />
    }

    return children
} 

export default DoctorProtectedRoute