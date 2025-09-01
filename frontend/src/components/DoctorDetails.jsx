import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Feedback from "./Feedback";
import axios from "axios";
import { BASE_URL } from "./constants";
import AppointmentBooking from "./AppointmentBooking";
import { StarIcon } from "@heroicons/react/outline";
import fallbackImg from '../assets/images/femaleDr.jpg'

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isPatientAuthed = useSelector((s) => s.patientAuth.isAuthenticated);

  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(BASE_URL + `/doctor/details/${id}`, {
          withCredentials: true,
        });
        setDoctor(res.data);
        setImgSrc(res.data.imgUrl || fallbackImg);
        setLoading(false);
      } catch (error) {
        setError("Doctor not found");
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-teal-600">
          Loading doctor details...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="bg-gray-50 py-8 px-4 md:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Doctor Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Doctor Image */}
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-teal-300 flex-shrink-0">
            <img
              src={imgSrc}
              alt={doctor.name}
              onError={() => setImgSrc(fallbackImg)}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Doctor Basic Info */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Dr. {doctor.name}</h2>
            <p className="text-teal-600 text-lg font-medium mt-1">
              {doctor.degree ? `${doctor.degree}, ` : ""}{doctor.department}
            </p>

            <div className="mt-4 flex items-center justify-center md:justify-start space-x-4">
              {doctor.experience && (
                <span className="text-gray-700 text-sm flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  {doctor.experience} years
                </span>
              )}
              {doctor.isAvailable !== undefined && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doctor.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {doctor.isAvailable ? "Available" : "Not Available"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Appointment Booking */}
          <div className="lg:col-span-1">
            <AppointmentBooking
              doctorId={id}
              isPatientAuthed={isPatientAuthed}
              navigateToAuth={() => navigate("/auth")}
              doctorFees={doctor.fees}
            />
          </div>

          {/* Right Column: About/Feedback Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "about"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("feedback")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "feedback"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Feedback & Reviews
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "about" && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      About Dr. {doctor.name.split(" ")[0]}
                    </h3>
                    {doctor.about ? (
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {doctor.about}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic mb-6">
                        No information provided
                      </p>
                    )}

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Professional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctor.experience && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-500 mb-1">
                              Experience
                            </h5>
                            <p className="text-gray-800">
                              {doctor.experience} years
                            </p>
                          </div>
                        )}
                        {doctor.degree && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-500 mb-1">
                              Qualifications
                            </h5>
                            <p className="text-gray-800">{doctor.degree}</p>
                          </div>
                        )}
                        {doctor.department && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-500 mb-1">
                              Specialization
                            </h5>
                            <p className="text-gray-800">{doctor.department}</p>
                          </div>
                        )}
                        {doctor.email && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-500 mb-1">Email</h5>
                            <p className="text-gray-800">{doctor.email}</p>
                          </div>
                        )}
                        {doctor.phone && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-500 mb-1">Phone</h5>
                            <p className="text-gray-800">{doctor.phone}</p>
                          </div>
                        )}
                        {doctor.fees && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-500 mb-1">Fees</h5>
                            <p className="text-gray-800">₹{doctor.fees}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "feedback" && <Feedback dId={id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
