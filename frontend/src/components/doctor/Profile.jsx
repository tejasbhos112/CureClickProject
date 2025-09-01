import axios from 'axios'
import { useEffect, useState } from 'react'
import {BASE_URL} from "../constants"
import { useNavigate } from 'react-router'

const Profile = () => {
  const [response, setResponse] = useState("")
  const [edit,setEdit] = useState(null)
  const [original, setOriginal] = useState({})
  const [formData, setFormData] = useState({})
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) =>{
    const file = e.target.files[0]
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  useEffect(()=>{
    const getDoctorProfile = async () => {
      try {
        const res = await axios.get(BASE_URL + "/doctor/profile", {
          withCredentials: true,
        });
        setResponse(res.data);
        setFormData(res.data)
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    getDoctorProfile()
  },[])
  
  const handleEdit = () => {
    setEdit(true)
  }

  const handleCancel = () => {
    setEdit(false)
    setSelectedFile(null);
    setPreview(null);
    setFormData(response); // Reset to original data
  }

  const handleInputChange = (e) => {
    const{name, value} = e.target
    setFormData((prev)=>({
      ...prev,
      [name] : value
    }))
  }

  const handleInputSave = async () => {
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      if (!formData) {
        console.log("formData is empty or undefined");
        return;
      }

      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (["age", "experience", "fees"].includes(key) && value !== "") {
          data.append(key, Number(value));
        } else if (key === "isAvailable") {
          data.append(key, Boolean(value));
        } else {
          data.append(key, value);
        }
      });
      
      if (selectedFile) {
        data.append("imgUrl", selectedFile);
      }

      const res = await axios.patch(`${BASE_URL}/doctor/profile`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(res.data);
      setOriginal(res.data);
      setEdit(false);
      setSelectedFile(null);
      setPreview(null);
      setSuccessMsg("Profile Updated Successfully!");
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      setErrorMsg("Failed to update profile. Please check image size/format.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="pt-24 min-h-[calc(100vh-6rem)] bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b bg-gradient-to-r from-teal-50 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Edit Doctor Profile</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your professional information and contact details.</p>
                </div>
                <div className="hidden md:block">
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {successMsg && (
              <div className="mx-6 md:mx-8 mt-4 p-3 bg-green-50 text-green-700 border border-green-100 rounded-lg">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mx-6 md:mx-8 mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg">
                {errorMsg}
              </div>
            )}

            <div className="px-6 md:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avatar */}
              <div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-36 h-36 rounded-full overflow-hidden ring-2 ring-teal-200 shadow-sm hover:shadow-md transition cursor-pointer relative group"
                    onClick={() => edit && document.getElementById('fileInput')?.click()}
                    title={edit ? "Change photo" : "Profile photo"}
                  >
                    <img
                      src={preview || response.imgUrl || "/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {edit && (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                        Change
                      </div>
                    )}
                  </div>
                  {edit && (
                    <>
                      <button
                        type="button"
                        className="mt-3 text-sm text-teal-600 hover:text-teal-700"
                        onClick={() => document.getElementById('fileInput')?.click()}
                      >
                        Upload new photo
                      </button>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">JPG or PNG, up to 2MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Phone Number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Speciality</label>
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Your speciality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Your degree"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Years of experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Consultation fee"
                    />
                  </div>

                  {/* About Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">About</label>
                    <textarea
                      name="about"
                      rows="4"
                      value={formData.about || ""}
                      onChange={handleInputChange}
                      disabled={!edit}
                      className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        !edit ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                      placeholder="Tell patients about your expertise and experience..."
                    />
                  </div>

                  {/* Availability Toggle */}
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      disabled={!edit}
                      checked={Boolean(formData.isAvailable)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isAvailable: e.target.checked,
                        }))
                      }
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Available for Appointments
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                    {!edit ? (
                      <button
                        type="button"
                        className="rounded-lg bg-teal-600 text-white px-6 py-2.5 font-semibold shadow-sm hover:bg-teal-700"
                        onClick={handleEdit}
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-lg border text-gray-700 bg-white hover:bg-gray-50"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          onClick={handleInputSave}
                          className={`rounded-lg bg-teal-600 text-white px-6 py-2.5 font-semibold shadow-sm hover:bg-teal-700 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {saving ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </span>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile
 