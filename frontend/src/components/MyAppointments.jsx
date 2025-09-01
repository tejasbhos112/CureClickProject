import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "./constants";
import Header from "./Header";
import { format, parseISO } from "date-fns";
import fallbackImg from '../assets/images/femaleDr.jpg'
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Chat from "./Chat";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.patientAuth);
  const patient = useSelector((state) => state.patient);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("MyAppointments - isAuthenticated:", isAuthenticated);
    console.log("MyAppointments - patient:", patient);
    const fetchAppointments = async () => {
      if (!isAuthenticated || !patient) {
        setError("Please login to view your appointments.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(BASE_URL + "/patient/appointment", {
          withCredentials: true,
        });
        setAppointments(res.data.appointments);
        console.log("Fetched appointments:", res.data.appointments);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again later.");
        setLoading(false);
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [isAuthenticated, patient]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(
        BASE_URL + `/patient/appointment/cancel/${appointmentId}`,
        {},
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );
      toast.success("Appointment cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  const handleStartChat = (appointment) => {
    setSelectedAppointment(appointment);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-2xl text-teal-600">
            Loading appointments...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
          <div className="text-2xl text-red-600">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-8 px-4 md:px-8 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Your Booked Appointments
          </h1>
          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-600">
              <p className="text-lg">No appointments booked yet.</p>
              <p className="text-sm mt-2">
                Start by browsing our doctors and booking your first appointment!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between"
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <img
                      src={appointment.doctorId ? appointment.doctorId.imgUrl : fallbackImg}
                      alt={appointment.doctorId ? appointment.doctorId.name : "Unknown Doctor"}
                      className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-teal-300"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Dr. {appointment.doctorId ? appointment.doctorId.name : "Unknown Doctor"}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {appointment.doctorId ? appointment.doctorId.department : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm w-full md:w-auto">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500">Date:</p>
                      <p className="font-medium text-gray-800">
                        {format(parseISO(appointment.date), "PPP")}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500">Time:</p>
                      <p className="font-medium text-gray-800">
                        {appointment.time}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500">Consultation Type:</p>
                      <p className="font-medium text-gray-800 capitalize">
                        {appointment.type}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500">Status:</p>
                      <p
                        className={`font-medium ${
                          appointment.status === "accepted"
                            ? "text-green-600"
                            : appointment.status === "cancelled"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {appointment.status}
                      </p>
                    </div>
                    {appointment.reason && (
                      <div className="bg-gray-50 p-3 rounded-lg col-span-full">
                        <p className="text-gray-500">Reason:</p>
                        <p className="font-medium text-gray-800">
                          {appointment.reason}
                        </p>
                      </div>
                    )}
                    {(appointment.status === "pending" ||
                      appointment.status === "accepted") && (
                      <div className="col-span-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          Cancel Appointment
                        </button>
                        {appointment.status === "accepted" && (
                          <button
                            onClick={() => handleStartChat(appointment)}
                            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                          >
                            Start Chat
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedAppointment && (
        <Chat
          appointment={selectedAppointment}
          onClose={handleCloseChat}
          userType="patient"
          userId={patient._id}
        />
      )}
    </>
  );
};

export default MyAppointments;
