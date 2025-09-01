import React from 'react'
import Home from '../Home'
import Services from '../Services'
import DoctorList from '../DoctorList'
import Footer from '../Footer'
import Departments from '../Departments'
import EmergencyContact from '../EmergencyContact'
import ReviewsSection from '../ReviewsSection'

const HomePage = () => {
  return (
    <div id="home-section">
        
        <Home />
        <Services id="services-section"/>
        <Departments id="departments-section"/>
        <DoctorList id="doctor-section"/>
        <ReviewsSection />
        <EmergencyContact />
        <Footer />
    </div>
  )
}

export default HomePage