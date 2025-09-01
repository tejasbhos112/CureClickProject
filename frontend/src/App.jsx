import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./components/Home";
import HomePage from "./components/navigation/HomePage";
import { Provider, useSelector } from "react-redux";
import appStore from "./components/appStore";
import Services from "./components/Services";
import PatientProfile from "./components/PatientProfile";
import DoctorCard from "./components/DoctorCard";
import DoctorDetails from "./components/DoctorDetails";
import DoctorList from "./components/DoctorList";
import DrDashboard from "./components/doctor/DrDashboard";
import Appointments from "./components/doctor/Appointments";
import Profile from "./components/doctor/Profile";
import DrDashboardLayout from "./components/doctor/DrDashboardLayout";
import DoctorProtectedRoute from "./components/DoctorProtectedRoute";
import PatientProtectedRoute from "./components/PatientProtectedRoute";
import EditProfile from "./components/EditProfile";
import Auth from "./components/Auth";
import DoctorProfile from "./components/doctor/Profile";
import MyAppointments from "./components/MyAppointments";
import ConsultJoin from "./components/ConsultJoin";
import Header from "./components/Header"; // Make sure Header is imported here if it's not already used as a component in a route

function App() {

 
  return (
   <Provider store={appStore}>
     <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/patient/signup" element={<Auth />} />
        <Route path="/patient/login" element={<Auth />} />
         <Route path="/auth" element={<Auth />} />
        <Route path="/doctor/list" element = {<DoctorList />} />
        <Route path="/doctor/details/:id" element = {<DoctorDetails />} />
        <Route 
        path="/patient/profile"
        element={
          <PatientProtectedRoute>
            <PatientProfile />
          </PatientProtectedRoute>
        }
        />
         <Route 
        path="/patient/edit/profile"
        element={
          <PatientProtectedRoute>
            <EditProfile />
          </PatientProtectedRoute>
        }
        />
        <Route path="/my-appointments" element={<PatientProtectedRoute allowedRoles={["patient"]}><MyAppointments /></PatientProtectedRoute>} />
        <Route path="/doctor/profile" element={<DoctorProtectedRoute allowedRoles={["doctor"]}><DoctorProfile /></DoctorProtectedRoute>} />
        <Route path="/consult/:appointmentId" element={<ConsultJoin />} />

       {/* doctor routes */}
         <Route path="/doctor/login" element={<Auth/>} />
         <Route path="/doctor/register" element={<Auth/>} />
        <Route path="/doctor/dashboardLayout" element={
          <DoctorProtectedRoute>
            <DrDashboardLayout />
          </DoctorProtectedRoute>
        }
        >

        <Route path="dashboard" element = {<DrDashboard />} />
        <Route path="appointments" element = {<Appointments/>} />
        <Route path="profile" element = {<Profile/>} />
        </Route>
      </Routes>
    </BrowserRouter>

   </Provider>
     );
}

export default App;