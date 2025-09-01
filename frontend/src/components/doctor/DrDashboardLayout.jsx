import axios from 'axios';
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import {BASE_URL} from "../constants"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducer/DrAuthSlice';
import { removeDoctor } from '../../reducer/doctorSlice';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserIcon, 
  LogoutIcon,
  ChartBarIcon
} from '@heroicons/react/outline';

const DrDashboardLayout = () => {
 
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const name = useSelector((state) => state.doctor.name)
  const imgUrl = useSelector((state) => state.doctor.imgUrl)

  const handleLogout = async() => {
    try {
      const res = await axios.post(BASE_URL + "/doctor/logout",
        {},
        {withCredentials:true}
      )
      dispatch(logout())
      dispatch(removeDoctor())
      navigate("/doctor/login")
    } catch (error) {
      console.log(error.message);
    }
  }

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block relative">
        <div className="p-6 h-full flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-800">Doctor Portal</h1>
          </div>

          {/* Doctor Profile */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <img 
                src={imgUrl || "https://via.placeholder.com/40"} 
                alt="Doctor" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Dr. {name}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <Link 
              to="/doctor/dashboardLayout/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('dashboard') 
                  ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            
            <Link 
              to="/doctor/dashboardLayout/appointments"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('appointments') 
                  ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="w-5 h-5 mr-3" />
              Appointments
            </Link>
            
            <Link 
              to="/doctor/dashboardLayout/profile"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('profile') 
                  ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Profile
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogoutIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {isActive('dashboard') && 'Dashboard'}
                {isActive('appointments') && 'Appointments'}
                {isActive('profile') && 'Profile'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, Dr. {name}
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DrDashboardLayout;
