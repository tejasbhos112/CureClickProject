import React from 'react';
import aboutImage from '../assets/images/about.webp';
import { PhoneIcon, MailIcon } from '@heroicons/react/outline';

const EmergencyContact = () => {
  return (
    <section className="bg-white py-16" id="emergency-contact-section">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Emergency? For any Help <br/> Contact Us Now
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            In times of urgent medical need, quick and reliable access to care is crucial. Our dedicated team is here to provide immediate support and connect you with the right medical professionals. Don't hesitate to reach out for any emergency or pressing health concerns.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            We understand that health emergencies can be stressful, and our priority is to ensure you receive prompt and compassionate assistance. Contact us directly for rapid response and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 justify-center md:justify-start">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
              <PhoneIcon className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-gray-600 text-sm">Call Now</p>
                <p className="text-xl font-bold text-gray-900">+821-456-789</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
              <MailIcon className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-gray-600 text-sm">Mail Us</p>
                <p className="text-xl font-bold text-gray-900">hello@info.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <img 
            src={aboutImage}
            alt="Emergency Contact" 
            className="w-full max-w-2xl rounded-lg shadow-xl object-cover h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default EmergencyContact;
