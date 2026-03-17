
// import React from 'react'
// import { Navigate, Outlet } from 'react-router-dom'

// const ProtectedRoute = () => {
//     const isLoggedIn = window.localStorage.getItem("user")
//     const worker = JSON.parse(localStorage.getItem('worker'));

//       if (!user ) {
//     return <Navigate to="/login" replace />;
//   }
//   if(!worker){
//     return <Navigate to="/celogin" replace />;
//   }

//     // return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />


//     // console.log(isLoggedIn)

  
//     // const cust = JSON.parse(isLoggedIn)
//     // console.log(cust.username)
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default ProtectedRoute


import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const worker = JSON.parse(localStorage.getItem('worker'));

  if (role === 'customer') {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  if (role === 'worker') {
    if (!worker) {
      return <Navigate to="/celogin" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;