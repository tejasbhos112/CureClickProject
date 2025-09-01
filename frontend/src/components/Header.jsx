import React from 'react'
import clock from '../assets/images/clock.png'
import phoneCall from "../assets/images/phoneCall.png"
import telegram from "../assets/images/telegram.png"
import facebook from "../assets/images/facebook.png"
import twitter from "../assets/images/twitter.png"
import instagram from "../assets/images/instagram.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PatientProfile from './PatientProfile'
import { useSelector } from 'react-redux'

const Header = () => {
   const token = useSelector((state) => state.patientAuth.token)
    console.log("token",token);
    const location = useLocation()
    const navigate = useNavigate()

  const handleClickScroll = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      return
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <div className=''>
        <div className="navbar shadow-lg fixed top-0 left-0 right-0 bg-[#010f26] z-50 flex justify-between items-center py-3 px-6">
  <div className=" flex items-center">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a onClick={() => handleClickScroll('home-section')}>Home</a></li>
        <li>
          <a onClick={() => handleClickScroll('departments-section')}>Departments</a>
        </li>
       <li><a onClick={() => handleClickScroll('services-section')}>Services</a></li>
       <li><a onClick={() => handleClickScroll('reviews-section')}>Testimonials</a></li>
       <li><a onClick={() => handleClickScroll('emergency-contact-section')}>Contact</a></li>
      </ul>
    </div>
    <a className='font-bold text-2xl text-white tracking-wide hover:text-teal-300 transition-colors duration-300'>CureClick</a>
  </div>
  <div className="navbar-center hidden lg:flex ">
    <ul className="menu menu-horizontal px-1">
      <li className='font-bold text-lg text-white hover:text-teal-300 transition-colors duration-300'><a onClick={() => handleClickScroll('home-section')}>Home</a></li>
      <li>
        <details>
          <summary className='font-bold text-lg text-white hover:text-teal-300 transition-colors duration-300'><a onClick={() => handleClickScroll('departments-section')}>Departments</a></summary>
        </details>
      </li>
      <li className='font-bold text-lg text-white hover:text-teal-300 transition-colors duration-300'><a onClick={() => handleClickScroll('services-section')}>Services</a></li>
      <li className='font-bold text-lg text-white hover:text-teal-300 transition-colors duration-300'><a onClick={() => handleClickScroll('reviews-section')}>Testimonials</a></li>
      <li className='font-bold text-lg text-white hover:text-teal-300 transition-colors duration-300'><a onClick={() => handleClickScroll('emergency-contact-section')}>Contact</a></li>
    </ul>
  </div>
 <div className=''>
 {
  token ? <>
            <PatientProfile />
            
  </> : <>
   <div className="dropdown dropdown-end " >
  <Link to="/patient/login" tabIndex={0} role="button" className="btn m- bg-teal-500 border-none text-white ">
    Create Account
    </Link>
  
</div>
  </>
 }
 </div>
</div>
    </div>
    </>
  )
}

export default Header