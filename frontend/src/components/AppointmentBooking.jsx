import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "./constants";
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  OfficeBuildingIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { toast } from "react-toastify";

const generateTimeSlots = (startHour = 9, endHour = 17, intervalMin = 30) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMin) {
      const hour12 = ((h + 11) % 12) + 1;
      const ampm = h < 12 ? "AM" : "PM";
      const mm = String(m).padStart(2, "0");
      slots.push(`${hour12}:${mm} ${ampm}`);
    }
  }
  return slots;
};

const AppointmentBooking = ({
  doctorId,
  isPatientAuthed,
  navigateToAuth,
  doctorFees,
}) => {
  const [mode, setMode] = useState("online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingErr, setBookingErr] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const handleBook = async () => {
    setBookingMsg("");
    setBookingErr("");

    if (!isPatientAuthed) {
      navigateToAuth();
      return;
    }

    if (!date || !time || !mode) {
      setBookingErr("Please select date, time and consultation mode");
      return;
    }

    try {
      setBookingLoading(true);
      await axios.post(
        `${BASE_URL}/patient/appointment/book`,
        {
          doctorId,
          date,
          time,
          type: mode,
          reason,
        },
        { withCredentials: true }
      );
      toast.success("Appointment booked successfully!");
      navigate('/my-appointments');
    } catch (err) {
      setBookingErr(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to book appointment"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (!isPatientAuthed) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center h-full flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Please Log In to Book an Appointment
        </h3>
        <p className="text-gray-600 mb-6">
          You need to be logged in as a patient to book appointments.
        </p>
        <button
          onClick={navigateToAuth}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Log In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        <CalendarIcon className="w-5 h-5 mr-2 text-teal-600" />
        Book Appointment
      </h2>

      {/* Consultation Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Consultation Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setMode("online")}
            className={`w-full text-left p-4 rounded-lg border transition ${mode === "online" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <div className="flex items-center">
              <VideoCameraIcon className="w-5 h-5 mr-3 text-teal-600" />
              <div>
                <p className="font-medium">Online Consultation</p>
                <p className="text-xs text-gray-500">Video call appointment</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setMode("offline")}
            className={`w-full text-left p-4 rounded-lg border transition ${mode === "offline" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <div className="flex items-center">
              <OfficeBuildingIcon className="w-5 h-5 mr-3 text-teal-600" />
              <div>
                <p className="font-medium">In-Person Visit</p>
                <p className="text-xs text-gray-500">Clinic appointment</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Date & Time Selection */}
      {mode === "online" && (
        <div className="mb-4 text-sm text-teal-700 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <span>
            You will receive a link to join the video call after booking.
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Choose a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for appointment (optional)
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          placeholder="E.g., routine check-up, specific symptoms, follow-up"
        />
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Appointment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Consultation:</span>
            <span className="font-medium">
              {mode === "online" ? "Online" : "In-Person"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{date || "Not selected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{time || "Not selected"}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
            <span className="text-gray-600">Fee:</span>
            <span className="font-medium text-teal-600">₹{doctorFees || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBook}
        disabled={bookingLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {bookingLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Booking...
          </span>
        ) : (
          "Confirm Appointment"
        )}
      </button>

      {mode === "online" && bookingMsg && (
        <button
          onClick={() => navigate("/video-call")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition shadow-sm hover:shadow-md mt-4"
        >
          Join Video Call
        </button>
      )}

      {/* Status Messages */}
      {bookingErr && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>{bookingErr}</div>
        </div>
      )}
      {bookingMsg && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-start">
          <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>{bookingMsg}</div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
