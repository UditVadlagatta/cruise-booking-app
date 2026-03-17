import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SubNavbar from "./components/SubNavbar";
import ProfilePage from "./subNavbarPages/ProfilePage";
import Cruise from "./subNavbarPages/Cruise";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./components/NotFound";
import Booking from "./subNavbarPages/Booking";
import Payment from "./subNavbarPages/Payment";
import PaymentDetails from "./subNavbarPages/PaymentDetails";
import BookingCruise from "./subNavbarPages/BookingCruise";
import PaymentBookingCruise from "./subNavbarPages/PaymentBookingCruise";
import Invoice from "./subNavbarPages/Invoice";
import CELogin from "./api/companyEmployee/pages/CELogin";
import CESignup from "./api/companyEmployee/pages/CESignup";
import CESubNavbar from "./api/companyEmployee/pages/CESubNavbar";
import CEProfilePage from "./api/companyEmployee/CESubNavbarPages/CEProfilePage";
import { div } from "framer-motion/client";
import CECruisePage from "./api/companyEmployee/CESubNavbarPages/CECruisePage";
import UpdateCruise from "./api/companyEmployee/pages/UpdateCruise";
import AddCruise from "./api/companyEmployee/pages/AddCruise";
import CustomerList from "./api/companyEmployee/pages/CustomerList";
import CECustomerBooking from "./api/companyEmployee/pages/CECustomerBooking";
import CECustomerEdit from "./api/companyEmployee/pages/CECustomerEdit";
import CECustomerBkEdit from "./api/companyEmployee/pages/customerBkEdit/CECustomerBkEdit";
import CEOpenCruise from "./api/companyEmployee/pages/CEOpenCruise";
import CEAllBookings from "./api/companyEmployee/pages/CEAllBookings";
import CEUserDashboard from "./api/companyEmployee/CESubNavbarPages/CEUserDashboard";
// import CECruiseStatus from "./api/companyEmployee/CESubNavbarPages/CEBookingStatus";
import CEBookingStatus from "./api/companyEmployee/CESubNavbarPages/CEBookingStatus";
// import CustomerBkEdit from "./api/companyEmployee/pages/CustomerBkEdit/CustomerBkEdit";
// import CustomerBkEdit from "./api/companyEmployee/pages/customerBkEdit/CustomerBkEdit";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
  });

  const [worker, setWorker] = useState(() => {
    const savedWorker = localStorage.getItem("worker");
    return savedWorker && savedWorker !== "undefined" ? JSON.parse(savedWorker) : null;
  });

  const isLoggedIn = !!user;
  const isWorkerLoggedIn = !!worker;
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear(); // Clears everything at once
    setUser(null);
    setWorker(null);
  };

  useEffect(() => {
    const handleStorage = () => {
      const updatedUser = localStorage.getItem("user");
      const updatedWorker = localStorage.getItem("worker");
      setUser(updatedUser && updatedUser !== "undefined" ? JSON.parse(updatedUser) : null);
      setWorker(updatedWorker && updatedWorker !== "undefined" ? JSON.parse(updatedWorker) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} worker={worker} onLogout={handleLogout} />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* --- AUTH ROUTES: DEFINED ONCE WITH REDIRECT LOGIC --- */}
        
        {/* Customer Auth */}
<Route 
  path="/login" 
  element={
    isLoggedIn ? <Navigate to="/dashboard/profile" replace /> : 
    (isWorkerLoggedIn ? <Navigate to="/cedashboard/ceprofile" replace /> : <Login />)
  } 
/>
<Route 
  path="/signup" 
  element={
    isLoggedIn ? <Navigate to="/dashboard/profile" replace /> : 
    (isWorkerLoggedIn ? <Navigate to="/cedashboard/ceprofile" replace /> : <Signup />)
  } 
/>

{/* Worker Auth */}
<Route 
  path="/celogin" 
  element={
    isWorkerLoggedIn ? <Navigate to="/cedashboard/ceprofile" replace /> : 
    (isLoggedIn ? <Navigate to="/dashboard/profile" replace /> : <CELogin />)
  } 
/>
<Route 
  path="/cesignup" 
  element={isWorkerLoggedIn ? <Navigate to="/cedashboard/ceprofile" replace /> : <CESignup />} 
/>

        {/* --- CUSTOMER PROTECTED AREA --- */}
        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/dashboard" element={<SubNavbar />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cruise" element={<Cruise />} />
            <Route path="booking" element={<Booking />} />
            <Route path="payment" element={<Payment />} />
            <Route path="payment-details" element={<PaymentDetails />} />
            <Route path="booking-cruise" element={<BookingCruise />} />
            <Route path="payment/:bookingCode" element={<PaymentBookingCruise />} />
            <Route path="invoice" element={<Invoice />} />
          </Route>
        </Route>

        {/* --- WORKER PROTECTED AREA --- */}
        <Route element={<ProtectedRoute role="worker" />}>
          <Route path="/cedashboard" element={<CESubNavbar worker={worker} />}>
            <Route index element={<Navigate to="ceprofile" replace />} />
            <Route path="ceprofile" element={<CEProfilePage />} />
            <Route path="cecustomerlist" element={ <CustomerList/> } /> 
            <Route path="cecruiselist" element={<CECruisePage/>} />
            <Route path="cecruiselist/update-cruise" element={<UpdateCruise/>} />
            <Route path="cecruiselist/open-cruise" element={<CEOpenCruise/>} />
            <Route path="cecruiselist/add-cruise" element={<AddCruise/>} />

            <Route path="cecustomerlist/cecustomer-booking" element={<CECustomerBooking/>}/>
            <Route path="cecustomerlist/cecustomer-edit" element={<CECustomerEdit/>}/>
            <Route path="cecustomerlist/cecustomer-booking-edit" element={<CECustomerBkEdit/>}/>

            <Route path="ce-all-bookings" element={<CEAllBookings/>} />

            <Route path="ce-customer-dashboard" element={<CEUserDashboard/>} />

            <Route path="ce-cruise-status" element={<CEBookingStatus/>} />


            

            
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;