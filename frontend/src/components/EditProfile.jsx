import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "./constants";
import { useDispatch } from "react-redux";
import { addPatient } from "../reducer/patientSlice";
import Header from "./Header";
import { useNavigate } from "react-router";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    imgUrl: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getPatientProfile = async () => {
      try {
        const res = await axios.get(BASE_URL + "/patient/profile", {
          withCredentials: true,
        });
        setFormData(res.data);
        setPreviewImage(res.data.imgUrl);
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    getPatientProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imgUrl: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      errors.age = "Enter a valid age.";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required.";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      if (formData.imgUrl) {
        data.append("imgUrl", formData.imgUrl);
      }

      const res = await axios.patch(`${BASE_URL}/patient/profile`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Profile Updated Successfully!");
      setErrorMsg("");
      setFormErrors({});
      setFormData(res.data);
      setPreviewImage(res.data.imgUrl);
      dispatch(addPatient(res.data));
    } catch (error) {
      setErrorMsg("Failed to update profile.");
      setSuccessMsg("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="pt-24 min-h-[calc(100vh-6rem)] bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b bg-gradient-to-r from-teal-50 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Edit Patient Profile</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your personal information and contact details.</p>
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
                    onClick={() => fileInputRef.current?.click()}
                    title="Change photo"
                  >
                    <img
                      src={previewImage || "/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                      Change
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-sm text-teal-600 hover:text-teal-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload new photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">JPG or PNG, up to 2MB</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="you@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Your age"
                  />
                  {formErrors.age && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.gender && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
