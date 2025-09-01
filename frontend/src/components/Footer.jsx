import React from 'react';
import facebook from "../assets/images/facebook.png";
import twitter from "../assets/images/twitter.png";
import instagram from "../assets/images/instagram.png";
import telegram from "../assets/images/telegram.png";
import phoneCall from "../assets/images/phoneCall.png";
import clock from "../assets/images/clock.png";
import { PhoneIcon, MailIcon, LocationMarkerIcon } from '@heroicons/react/outline';

const Footer = () => {
  return (
    <footer className="bg-[#010f26] text-white py-4 text-center" id="contact-section">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CureClick. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
