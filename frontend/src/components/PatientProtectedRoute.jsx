import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const PatientProtectedRoute = ({children}) => {
   const { isAuthenticated } = useSelector((state) => state.patientAuth)
     
    if(!isAuthenticated)
    {
        return <Navigate to="/patient/login" replace />
    }

    return children
}

export default PatientProtectedRoute