import axios from "axios";
import React from "react";
import { BASE_URL } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logout } from "../reducer/PatientAuthSlice";
import { removePatient } from "../reducer/patientSlice";

const PatientProfile = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const img = useSelector((store)=>store.patient.imgUrl)


  const handleLogout = async() => {

   try {

     const res = await axios.post(BASE_URL+"/patient/logout",
      {}
    ,{withCredentials : true})

    dispatch(logout())
    dispatch(removePatient())

    navigate("/patient/login")
    
   } catch (error) {
    console.log("error :",error.message);
    
   }
    
  }

  return (
    <div className="dropdown dropdown-end ">
      <div className="avatar" tabIndex={0}>
        <div className="w-12 h-12 rounded-full">
          <img src={img} />
        </div>
      </div>

      <div >
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-5 gap-3 shadow-sm">
          <li className="text-black ">
            <Link to="/patient/edit/profile">Edit Profile</Link> </li>
          <li className="text-black">
            <Link to="/my-appointments">Your Appointments</Link>
          </li>
         <div className="flex justify-center p-2">
             <button className="text-white bg-red-500 w-1/2 rounded-lg p-2"
             onClick={handleLogout}>Logout</button>
         </div>
        </ul >
        
      </div>
    </div>
  );
};

export default PatientProfile;
