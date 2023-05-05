
import { Navigate, Outlet } from 'react-router-dom' 
import { useContext, useEffect } from 'react'
import { GlobalAuthorizedContext } from '../context/GlobalAuthorizedContext'

const ProtectedRoutes = () => {

    const { authorized } = useContext(GlobalAuthorizedContext) 

    return (
        authorized ? <Outlet /> : <Navigate to = "/log-in" />
    )
}

export default ProtectedRoutes