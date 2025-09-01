import React from 'react'
import Header from './Header'
import homeImg from "../assets/images/homeImg.jpg"
import healthcare from "../assets/images/healthcare.png"
import customerSupport from "../assets/images/customerSupport.png"
import telemedicine from "../assets/images/telemedicine.png"

const Home = () => {
  return (
    <>
       <div className="relative  ">
        <Header />
        <div className="relative">
          <img
            className="w-full h-[105vh] object-cover "
            src={homeImg}
            alt="img"
          />
          <div className='absolute inset-0 bg-black bg-opacity-60'></div>
          <div className="absolute top-16 left-20 w-2/5 text-white space-y-8 pb-12">
            <p className="text-xl font-bold text-teal-500 my-10">
              Smarter Service Care
            </p>
            <h1 className="text-7xl font-bold leading-tight">
              We are Committed to your Best Health
            </h1>
            <p className="font-semibold">
            Your trusted partner for health and wellness, providing expert care and innovative solutions

            </p>
          </div>
        </div>

        <div className='absolute bottom-0 left-0 z-0'>
            <div className=" bg-teal-100  mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-8 mt-4 ">
          <div className="flex flex-col items-center text-center">
            <img src={healthcare} className="h-12 w-12" alt="healthcare" />
            <h2 className="font-bold text-lg">Special Service</h2>
            <p >
              Lorem ipsum dolor sit amet consectetur adipisicing elit
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img
              src={customerSupport}
              className="h-12 w-12"
              alt="customer support"
            />
            <h2 className="font-bold text-lg">24/7 Advanced Care</h2>
            <p >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img src={telemedicine} className="h-12 w-12" alt="telemedicine" />
            <h2 className="font-bold text-lg">Video Consultation</h2>
            <p >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
        </div>
      </div>
     
   </>
  )
}

export default Home