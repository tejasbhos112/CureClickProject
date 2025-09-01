import React, { useEffect, useState } from 'react'
import DoctorCard from './DoctorCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { BASE_URL } from './constants'
import axios from 'axios'
import SectionHeader from './SectionHeader'

const SkeletonCard = () => (
  <div className="w-full">
    <div className="relative flex flex-col my-4 bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div className="h-56 bg-slate-100 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-2/3 bg-slate-100 animate-pulse rounded" />
        <div className="h-4 w-1/3 bg-slate-100 animate-pulse rounded" />
        <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
      </div>
      <div className="px-4 pb-4 pt-0 mt-1">
        <div className="h-9 w-24 bg-slate-100 animate-pulse rounded" />
      </div>
    </div>
  </div>
)

const DoctorList = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/doctor/all`)
        setDoctors(res.data)
      } catch (err) {
        setError('Failed to load doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  return (
    <div className="bg-white">
      <div className="pt-10">
        <SectionHeader
          eyebrow="Our Doctors"
          title="Our Specialized Doctors"
          subtitle="Meet our experienced specialists across key departments."
          align="center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {error && (
          <div className="text-center text-red-600 py-8">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            navigation
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-6"
          >
            {doctors.map((doctor, idx) => (
              <SwiperSlide key={doctor._id}>
                <div
                  className="transition-all duration-500"
                  style={{ transitionDelay: `${idx * 60}ms`, opacity: 1, transform: 'translateY(0)' }}
                >
                  <DoctorCard doctor={doctor} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  )
}

export default DoctorList