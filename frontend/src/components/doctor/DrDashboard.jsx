import { useState, useEffect } from "react";
import axios from "axios";
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/outline';
import { BASE_URL } from "../constants";

const DrDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalAppointments: 0,
    totalPatients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/doctor/appointment`, {
        withCredentials: true,
      });
      
      const appointmentsData = response.data.appointments;
      setAppointments(appointmentsData);

      // Calculate stats from real data
      const uniquePatients = new Set(appointmentsData.map(apt => apt.patientId?._id)).size;
      const totalEarnings = appointmentsData.reduce((sum, apt) => {
        // You might want to get doctor fees from doctor profile or appointment data
        // For now, using a default fee of 500
        return sum + (apt.status === 'completed' ? 500 : 0);
      }, 0);

      setStats({
        totalEarnings,
        totalAppointments: appointmentsData.length,
        totalPatients: uniquePatients
      });

      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(
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
      
      // Refresh dashboard data to update stats
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update appointment status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (timeString) => {
    return timeString; // Assuming time is already in a readable format
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      accepted: { color: 'bg-green-100 text-green-800' },
      rejected: { color: 'bg-red-100 text-red-800' },
      completed: { color: 'bg-blue-100 text-blue-800' },
      cancelled: { color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getModeBadge = (type) => {
    const color = type === "online" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your overview.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your overview.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const recentAppointments = appointments
    .filter(appointment => appointment.status === 'pending')
    .slice(0, 5); // Show only 5 most recent pending appointments

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalEarnings}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAppointments}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPatients}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Incoming Appointments</h2>
            <button 
              onClick={() => window.location.href = '/doctor/dashboardLayout/appointments'}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patientId?.name || "Unknown Patient"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.patientId?.email || "No email"}
                      </p>
                      <div className="flex items-center mt-1">
                        <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {formatDate(appointment.date)}, {formatTime(appointment.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="mb-1">{getModeBadge(appointment.type)}</div>
                      <div>{getStatusBadge(appointment.status)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No incoming appointments</p>
                <p className="text-sm">New appointment requests will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrDashboard;
