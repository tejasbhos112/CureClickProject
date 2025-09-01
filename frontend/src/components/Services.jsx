import React, { useEffect, useState } from 'react'
import cancer from "../assets/images/cancer.png"
import heartbeat from "../assets/images/heartbeat.png"
import kidney from "../assets/images/kidney.png";
import liver from "../assets/images/liver.png"
import neurology from "../assets/images/neurology.png"
import orthopedic from "../assets/images/orthopedic.png"
import SectionHeader from './SectionHeader'

const services = [
  { icon: cancer, title: 'Cancer Service', desc: 'Comprehensive oncology care with advanced therapies.' },
  { icon: liver, title: 'Liver Transplant', desc: 'Expert transplant program with multi-disciplinary care.' },
  { icon: kidney, title: 'Kidney Transplant', desc: 'Renal transplant and dialysis support under one roof.' },
  { icon: heartbeat, title: 'Cardiac Arrhythmia', desc: 'Arrhythmia diagnosis and minimally invasive treatments.' },
  { icon: neurology, title: 'Neurology Care', desc: 'Neuro diagnostics, stroke care, and rehabilitation.' },
  { icon: orthopedic, title: 'Orthopedic Care', desc: 'Joint replacement, sports injuries, and trauma care.' },
]

const Services = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className='bg-white' id="services-section">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 md:py-14 mx-auto">
          <SectionHeader
            eyebrow="Our Services"
            title="Our Healthcare Service"
            subtitle="Expert care across specialties powered by advanced diagnostics and experienced teams."
            align="center"
          />

          <div className="flex flex-wrap -m-4">
            {services.map((s, idx) => (
              <div key={s.title} className="xl:w-1/3 md:w-1/2 p-4">
                <div
                  className={`group relative border border-gray-200 p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-teal-500 hover:bg-teal-50 transform hover:scale-105 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="relative w-14 h-14 inline-flex items-center justify-center rounded-full bg-teal-100 mb-4 overflow-hidden shadow-sm group-hover:bg-teal-200 transition-colors duration-300">
                    <span className="absolute inset-0 rounded-full bg-teal-200/40 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <img src={s.icon} className='relative p-2 transition-transform duration-300 group-hover:scale-110' />
                  </div>
                  <h2 className="text-xl text-gray-900 font-bold mb-2">{s.title}</h2>
                  <p className="leading-relaxed text-base text-gray-700">{s.desc}</p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services