import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "./constants";
import { login as patientLogin } from "../reducer/PatientAuthSlice";
import { addPatient } from "../reducer/patientSlice";
import { login as doctorLogin } from "../reducer/DrAuthSlice";
import { addDoctor } from "../reducer/doctorSlice";
import femaleDr from "../assets/images/femaleDr.jpg";
import { Mail, Lock, User, Phone, Stethoscope, Eye, EyeOff } from "lucide-react";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const Input = ({ icon: Icon, rightIcon: RightIcon, onRightIconClick, ...props }) => (
  <div className="relative">
    {Icon && (
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
        <Icon size={18} />
      </span>
    )}
    <input
      {...props}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
        Icon ? "pl-9" : ""
      } ${props.className || ""}`}
    />
    {RightIcon && (
      <button
        type="button"
        onClick={onRightIconClick}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        aria-label="toggle"
      >
        <RightIcon size={18} />
      </button>
    )}
  </div>
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
  >
    {children}
  </select>
);

const Auth = () => {
  const [role, setRole] = useState("patient");
  const [isLoginForm, setIsLoginForm] = useState(true);

  // common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // patient register
  const [name, setName] = useState("");

  // doctor register
  const [docName, setDocName] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    if (isLoginForm) return email && password;
    if (role === "patient") return name && email && password;
    return docName && email && password && department && gender && phone;
  }, [isLoginForm, role, name, docName, email, password, department, gender, phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError("");
    setLoading(true);

    try {
      if (isLoginForm) {
        if (role === "patient") {
          const res = await axios.post(
            `${BASE_URL}/patient/login`,
            { email, password },
            { withCredentials: true }
          );
          dispatch(
            patientLogin({ email: res.data.data.email, token: res.data.token })
          );
          dispatch(addPatient(res.data.data));
          navigate("/");
        } else {
          const res = await axios.post(
            `${BASE_URL}/doctor/login`,
            { email, password },
            { withCredentials: true }
          );
          dispatch(
            doctorLogin({ email: res.data.data.email, token: res.data.token })
          );
          dispatch(addDoctor(res.data.data));
          navigate("/doctor/dashboardLayout/dashboard");
        }
      } else {
        if (role === "patient") {
          const res = await axios.post(
            `${BASE_URL}/patient/signup`,
            { name, email, password },
            { withCredentials: true }
          );
          dispatch(
            patientLogin({ email: res.data.data.email, token: res.data.token })
          );
          dispatch(addPatient(res.data.data));
          navigate("/");
        } else {
          const res = await axios.post(
            `${BASE_URL}/doctor/signup`,
            {
              name: docName,
              email,
              password,
              department,
              gender,
              phone,
            },
            { withCredentials: true }
          );
          dispatch(
            doctorLogin({ email: res.data.data.email, token: res.data.token })
          );
          dispatch(addDoctor(res.data.data));
          navigate("/doctor/dashboardLayout/dashboard");
        }
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.response?.data || err?.message ||
        "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Banner / Illustration */}
        <div className="hidden md:flex relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={femaleDr}
            alt="Healthcare Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-3xl font-bold">Care, simplified.</h2>
            <p className="text-sm text-white/90 mt-2">
              Book appointments, manage your profile, and connect with specialists—all in one place.
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          {/* Tabs */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  role === "patient" ? "bg-white shadow text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setRole("patient")}
                type="button"
              >
                Patient
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  role === "doctor" ? "bg-white shadow text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setRole("doctor")}
                type="button"
              >
                Doctor
              </button>
            </div>

            <button
              className="text-teal-600 text-sm hover:text-teal-700"
              onClick={() => setIsLoginForm((v) => !v)}
              type="button"
            >
              {isLoginForm ? "Need an account? Register" : "Have an account? Sign In"}
            </button>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isLoginForm ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {role === "patient" ? "Sign in or register as a patient." : "Sign in or register as a doctor."}
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Role-specific fields for register */}
            {!isLoginForm && role === "patient" && (
              <Field label="Full Name">
                <Input
                  icon={User}
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
            )}

            {!isLoginForm && role === "doctor" && (
              <>
                <Field label="Full Name">
                  <Input
                    icon={User}
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Department">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Stethoscope size={18} />
                    </span>
                    <Select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      style={{ paddingLeft: "2.25rem" }}
                    >
                      <option value="">Select department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </Select>
                  </div>
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Gender">
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Field>
                  <Field label="Phone">
                    <Input
                      icon={Phone}
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="^(?:\+91|91)?[6-9]\d{9}$"

                      title="Enter a valid 10-digit Indian phone number"
                      required
                    />
                  </Field>
                </div>
              </>
            )}

            {/* Common fields */}
            <Field label="Email">
              <Input
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Password">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword((v) => !v)}
              />
              {!isLoginForm && (
                <p className="text-xs text-gray-500 mt-1">Use at least 8 characters with a mix of letters, numbers and symbols.</p>
              )}
            </Field>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`w-full rounded-lg py-2.5 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                !canSubmit || loading
                  ? "bg-teal-300 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 focus:ring-teal-600"
              }`}
            >
              {loading ? "Please wait..." : isLoginForm ? "Sign In" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth; 