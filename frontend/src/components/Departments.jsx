import React from 'react';
import SectionHeader from './SectionHeader';


import newCardiologyImage from '../assets/images/cardiology.jpg';
import newDermatologyImage from '../assets/images/dermatology.jpg';
import newGeneralMedicineImage from '../assets/images/generalMedicine.jpg';
import newOrthopedicsImage from '../assets/images/orthopedics.jpeg';
import newPediatricsImage from '../assets/images/pediatrics.jpg';

const departmentsData = [
  { name: 'Cardiology', title: "Cardiology", desc: 'Specializing in heart conditions and cardiovascular health. Our expert cardiologists use advanced diagnostic tools and treatments to manage a wide range of cardiac issues, from preventive care to complex interventions. We prioritize your heart health with personalized treatment plans and compassionate support.', image: newCardiologyImage },
  { name: 'Orthopedics', title: "Orthopedics", desc: 'Expert care for bones, joints, muscles, and ligaments. Our orthopedic specialists provide comprehensive treatment for sports injuries, arthritis, fractures, and spinal conditions. We focus on restoring mobility and improving your quality of life through both surgical and non-surgical approaches.', image: newOrthopedicsImage },
  { name: 'Dermatology', title: "Dermatology", desc: 'Diagnosis and treatment of skin, hair, and nail conditions. Our dermatologists offer solutions for acne, eczema, psoriasis, skin cancer, and cosmetic concerns. We are dedicated to promoting healthy skin and addressing your unique dermatological needs with effective, personalized care.', image: newDermatologyImage },
  { name: 'General Medicine', title: "General Medicine", desc: 'Primary care and treatment for a wide range of illnesses. Our general medicine practitioners provide comprehensive health services, including preventive care, chronic disease management, and acute illness treatment. We focus on building lasting relationships with our patients to ensure holistic and continuous care.', image: newGeneralMedicineImage },
  { name: 'Pediatrics', title: "Pediatrics", desc: 'Comprehensive healthcare for infants, children, and adolescents. Our pediatricians are dedicated to the physical, mental, and emotional well-being of your child, from routine check-ups and vaccinations to managing childhood illnesses and developmental concerns. We provide a nurturing environment for growing healthy children.', image: newPediatricsImage },
];

const Departments = () => {
  const [activeDepartment, setActiveDepartment] = React.useState(departmentsData[0]);

  return (
    <section className="py-16 bg-white" id="departments-section">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow="Our Specializations"
          title="Explore Our Departments"
          subtitle="We offer a wide range of medical specialties to provide comprehensive care for all your health needs. Our expert teams are dedicated to your well-being."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ul className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
              {departmentsData.map((dept, index) => (
                <li
                  key={index}
                  className={`text-lg font-semibold py-3 px-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform
                    ${activeDepartment.name === dept.name ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-xl scale-105' : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'}`}
                  onClick={() => setActiveDepartment(dept)}
                >
                  {dept.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-2xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left relative transform transition-all duration-700 ease-in-out">
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-8 h-5/6 my-auto"></div> {/* Vertical line */}
            <div className="md:w-1/2 md:pl-12 md:pr-8 mb-6 md:mb-0">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4">{activeDepartment.title}</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {activeDepartment.desc}
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <img 
                src={activeDepartment.image}
                alt={activeDepartment.name}
                className="w-full max-w-sm rounded-lg shadow-2xl object-cover h-auto border-4 border-teal-500 transform transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Departments;