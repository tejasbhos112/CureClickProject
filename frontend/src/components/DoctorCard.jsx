

import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import fallbackImg from '../assets/images/femaleDr.jpg'

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()
  const [imgSrc, setImgSrc] = useState(doctor?.imgUrl || fallbackImg)

  const handleDoctor = () => {
    navigate(`/doctor/details/${doctor._id}`)
  }

  return (
    <div className="w-full">
      <div className="group relative flex flex-col my-4 bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative bg-slate-50">
          <img
            src={imgSrc}
            alt={doctor?.name || 'Doctor'}
            onError={() => setImgSrc(fallbackImg)}
            className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4">
          <h6 className="mb-1 text-slate-800 text-xl font-semibold line-clamp-1">{doctor.name}</h6>
          <p className='text-teal-600 font-medium'>{doctor.department}</p>
          {doctor.speciality && (
            <p className="text-slate-600 text-sm mt-1 line-clamp-2">{doctor.speciality}</p>
          )}
          {doctor.about && (
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{doctor.about}</p>
          )}
        </div>
        <div className="px-4 pb-4 pt-0 mt-1">
          <button
            className="rounded-md bg-teal-600 py-2 px-4 text-sm text-white font-medium transition-all shadow-md hover:bg-teal-700"
            type="button"
            onClick={handleDoctor}
          >
            Know more
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard