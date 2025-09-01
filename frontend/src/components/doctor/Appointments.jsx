import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  VideoCameraIcon
} from '@heroicons/react/outline';
import { BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DoctorChat from "./DoctorChat";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  
  // Get current doctor from Redux store
  const currentDoctor = useSelector((state) => state.doctor);

  // Fetch appointments from backend
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/doctor/appointment`, {
        withCredentials: true,
      });
      setAppointments(response.data.appointments);
      setError(null);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/doctor/appointment/${appointmentId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Update the appointment in the local state
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update appointment status");
    }
  };

  const handleStartChat = (appointment) => {
    setSelectedAppointment(appointment);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedAppointment(null);
    // Refresh appointments to get updated status
    fetchAppointments();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: ClockIcon },
      accepted: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircleIcon },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircleIcon },
      completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircleIcon },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircleIcon }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const color = paymentStatus === "paid" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200";
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${color}`}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  const getModeBadge = (type) => {
    const color = type === "online" ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-orange-100 text-orange-800 border-orange-200";
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${color}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">{error}</div>
          <button 
            onClick={fetchAppointments}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your patient appointments and schedules.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">{appointments.length}</div>
              <div className="text-sm text-gray-500">Total Appointments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {appointment.patientId?.name || "Unknown Patient"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patientId?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</div>
                          <div className="text-sm text-gray-500">{formatTime(appointment.time)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getModeBadge(appointment.type)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getPaymentBadge(appointment.paymentStatus)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {appointment.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateStatus(appointment._id, "accepted")}
                              className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                              title="Accept"
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => updateStatus(appointment._id, "rejected")}
                              className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium"
                              title="Reject"
                            >
                              <XCircleIcon className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}

                        {appointment.status === "accepted" && (
                          <div className="space-y-2">
                            <div className="text-green-600 text-sm font-medium">✓ Accepted</div>
                            <div className="flex flex-col space-y-1">
                              <button
                                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-teal-200 bg-white text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-colors text-xs font-medium"
                                onClick={() => updateStatus(appointment._id, "completed")}
                                title="Mark this appointment as completed"
                              >
                                <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                                Mark Complete
                              </button>
                              <button
                                className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow hover:from-teal-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 text-xs font-semibold"
                                onClick={() => handleStartChat(appointment)}
                                title="Open chat with this patient"
                              >
                                <VideoCameraIcon className="w-4 h-4 mr-1 text-white" />
                                Start Chat
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {appointment.status === "rejected" && (
                          <span className="text-red-600 text-sm font-medium">✗ Rejected</span>
                        )}
                        {appointment.status === "completed" && (
                          <span className="text-blue-600 text-sm font-medium">✓ Completed</span>
                        )}
                        {appointment.status === "cancelled" && (
                          <span className="text-orange-600 text-sm font-medium">✗ Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="text-gray-500">
                      <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium text-gray-900 mb-2">No appointments yet</p>
                      <p className="text-sm">Appointments will appear here when patients book with you.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedAppointment && currentDoctor && (
        <DoctorChat
          appointment={selectedAppointment}
          onClose={handleCloseChat}
          userType="doctor"
          userId={currentDoctor._id}
        />
      )}
    </div>
  );
};

export default Appointments;
