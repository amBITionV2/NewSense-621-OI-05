import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Shield, 
  Upload, FileText, ArrowRight, ArrowLeft, CheckCircle, Camera,
  CreditCard, Home as HomeIcon, Briefcase, Users as UsersIcon
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Role, 2: Aadhaar, 3: Details, 4: Additional (Citizen only)
  const [selectedRole, setSelectedRole] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState('');
  const [governmentIdFile, setGovernmentIdFile] = useState(null);
  const [governmentIdPreview, setGovernmentIdPreview] = useState('');
  const [citizenshipProofFile, setCitizenshipProofFile] = useState(null);
  const [citizenshipProofPreview, setCitizenshipProofPreview] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    alternateContact: '',
    aadhaarNumber: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    motherName: '',
    caste: '',
    religion: '',
    occupation: '',
    salary: '',
    hasIncome: 'yes',
    languagesSpoken: [],
    nativePlace: '',
    residenceType: '',
    governmentIdNumber: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle Aadhaar file upload and simulate OCR scanning
  const handleAadhaarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadhaarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadhaarPreview(reader.result);
        simulateAadhaarScan();
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate Aadhaar OCR scanning (without dummy data)
  const simulateAadhaarScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // In production, this would extract real data from the Aadhaar card image
      // For now, we just show the scanning animation
      setIsScanning(false);
    }, 2000);
  };

  // Handle language selection
  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(language)
        ? prev.languagesSpoken.filter(lang => lang !== language)
        : [...prev.languagesSpoken, language]
    }));
  };

  // Handle Government ID upload
  const handleGovernmentIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGovernmentIdFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGovernmentIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Citizenship Proof upload
  const handleCitizenshipProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCitizenshipProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  // Step 1: Role Selection
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-9 h-9 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Join Our Community
          </h2>
          <p className="mt-3 text-center text-lg text-gray-600">
            Select your role to get started
          </p>
        </div>

        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Citizen Role */}
            <button
              onClick={() => {
                setSelectedRole('citizen');
                setCurrentStep(2);
              }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Citizen
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Register to report issues, track complaints, and engage with your community
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-600 font-semibold">
                  <span>Register as Citizen</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </button>

            {/* Admin Role */}
            <button
              onClick={() => {
                setSelectedRole('admin');
                setCurrentStep(2);
              }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Admin
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Register to manage complaints, monitor activities, and oversee operations
                </p>
                <div className="flex items-center justify-center space-x-2 text-purple-600 font-semibold">
                  <span>Register as Admin</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Aadhaar Upload
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to role selection</span>
          </button>

          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              selectedRole === 'admin' 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                : 'bg-gradient-to-br from-blue-600 to-cyan-600'
            }`}>
              <CreditCard className="w-9 h-9 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Upload Aadhaar Card
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'll automatically extract your information
          </p>

          {/* Progress Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Role</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Aadhaar</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Details</span>
            </div>
            {selectedRole === 'citizen' && (
              <>
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                    4
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">Additional</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            {/* Aadhaar Upload */}
            <div className="mb-8">
              <label className="block text-center">
                <div className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                  aadhaarPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAadhaarUpload}
                    className="hidden"
                  />
                  {aadhaarPreview ? (
                    <div className="space-y-4">
                      <img src={aadhaarPreview} alt="Aadhaar Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Aadhaar Uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">Upload Aadhaar Card</p>
                      <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {isScanning && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <LoadingSpinner size="small" />
                  <span className="text-blue-700 font-medium">Scanning Aadhaar card...</span>
                </div>
              </div>
            )}

            {/* Admin: Government ID Upload */}
            {selectedRole === 'admin' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Official ID</h3>
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                    governmentIdPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGovernmentIdUpload}
                      className="hidden"
                    />
                    {governmentIdPreview ? (
                      <div className="space-y-4">
                        <img src={governmentIdPreview} alt="Government ID Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Government ID Uploaded</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">Upload Government ID</p>
                        <p className="text-sm text-gray-500">Employee ID, Service Card, etc.</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={() => setCurrentStep(3)}
              disabled={!aadhaarFile || (selectedRole === 'admin' && !governmentIdFile)}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Personal Details (Auto-filled or Manual)
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl px-4">
          <button
            onClick={() => setCurrentStep(2)}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to document upload</span>
          </button>

          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              selectedRole === 'admin' 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                : 'bg-gradient-to-br from-blue-600 to-cyan-600'
            }`}>
              <User className="w-9 h-9 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Personal Details
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Review and edit the auto-filled information
          </p>

          {/* Progress Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                3
              </div>
            </div>
            {selectedRole === 'citizen' && (
              <>
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                    4
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl px-4">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field px-4"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    className="input-field px-4"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field px-4"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field px-4"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name
                  </label>
                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="input-field px-4"
                    placeholder="Enter father's name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field px-4"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field px-4"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      id="location.address"
                      name="location.address"
                      type="text"
                      value={formData.location.address}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="location.city"
                      name="location.city"
                      type="text"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      id="location.state"
                      name="location.state"
                      type="text"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label htmlFor="location.pincode" className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      id="location.pincode"
                      name="location.pincode"
                      type="text"
                      value={formData.location.pincode}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field px-4 pr-12"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-field px-4 pr-12"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin: Government ID Number */}
              {selectedRole === 'admin' && (
                <div className="border-t pt-6">
                  <label htmlFor="governmentIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Government ID Number
                  </label>
                  <input
                    id="governmentIdNumber"
                    name="governmentIdNumber"
                    type="text"
                    value={formData.governmentIdNumber}
                    onChange={handleChange}
                    className="input-field px-4"
                    placeholder="Enter your government ID number"
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4 pt-6">
                {selectedRole === 'citizen' ? (
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Additional Info</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? <LoadingSpinner size="small" /> : (
                      <>
                        <span>Complete Registration</span>
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Additional Information (Citizen Only)
  if (currentStep === 4 && selectedRole === 'citizen') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl px-4">
          <button
            onClick={() => setCurrentStep(3)}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center space-x-2 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to personal details</span>
          </button>

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <UsersIcon className="w-9 h-9 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Additional Information
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Complete your profile with additional details
          </p>

          {/* Progress Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                4
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl px-4">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="alternateContact" className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Contact Number
                    </label>
                    <input
                      id="alternateContact"
                      name="alternateContact"
                      type="tel"
                      value={formData.alternateContact}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="Enter alternate contact"
                    />
                  </div>
                </div>
              </div>

              {/* Family & Personal Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Name
                    </label>
                    <input
                      id="motherName"
                      name="motherName"
                      type="text"
                      value={formData.motherName}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="Enter mother's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="nativePlace" className="block text-sm font-medium text-gray-700 mb-2">
                      Native Place
                    </label>
                    <input
                      id="nativePlace"
                      name="nativePlace"
                      type="text"
                      value={formData.nativePlace}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="Enter your native place"
                    />
                  </div>

                  <div>
                    <label htmlFor="caste" className="block text-sm font-medium text-gray-700 mb-2">
                      Caste
                    </label>
                    <select
                      id="caste"
                      name="caste"
                      value={formData.caste}
                      onChange={handleChange}
                      className="input-field px-4"
                    >
                      <option value="">Select Caste</option>
                      <option value="general">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-2">
                      Religion
                    </label>
                    <select
                      id="religion"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="input-field px-4"
                    >
                      <option value="">Select Religion</option>
                      <option value="hinduism">Hinduism</option>
                      <option value="islam">Islam</option>
                      <option value="christianity">Christianity</option>
                      <option value="sikhism">Sikhism</option>
                      <option value="buddhism">Buddhism</option>
                      <option value="jainism">Jainism</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Languages Spoken */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages You Speak</h3>
                <p className="text-sm text-gray-600 mb-4">Select all languages you can speak</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'Other'].map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.languagesSpoken.includes(language)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupation & Income */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      id="occupation"
                      name="occupation"
                      type="text"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="input-field px-4"
                      placeholder="Enter your occupation"
                    />
                  </div>

                  <div>
                    <label htmlFor="hasIncome" className="block text-sm font-medium text-gray-700 mb-2">
                      Do you earn money?
                    </label>
                    <select
                      id="hasIncome"
                      name="hasIncome"
                      value={formData.hasIncome}
                      onChange={handleChange}
                      className="input-field px-4"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {formData.hasIncome === 'yes' && (
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Salary/Income (₹)
                      </label>
                      <input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        className="input-field px-4"
                        placeholder="Enter monthly income"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Residence Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Residence Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="residenceType" className="block text-sm font-medium text-gray-700 mb-2">
                      Where and How Do You Live?
                    </label>
                    <select
                      id="residenceType"
                      name="residenceType"
                      value={formData.residenceType}
                      onChange={handleChange}
                      className="input-field px-4"
                    >
                      <option value="">Select Residence Type</option>
                      <option value="own_house">Own House</option>
                      <option value="rented_house">Rented House</option>
                      <option value="rented_flat">Rented Flat</option>
                      <option value="pg">PG (Paying Guest)</option>
                      <option value="hostel">Hostel</option>
                      <option value="family_house">Family House</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Citizenship Proof Upload */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof of Citizenship</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload any document that proves you are a citizen of this state (Electricity Bill, Ration Card, PAN Card, etc.)
                </p>
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                    citizenshipProofPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleCitizenshipProofUpload}
                      className="hidden"
                    />
                    {citizenshipProofPreview ? (
                      <div className="space-y-4">
                        <img src={citizenshipProofPreview} alt="Citizenship Proof Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Document Uploaded</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">Upload Citizenship Proof</p>
                        <p className="text-sm text-gray-500">Electricity Bill, Ration Card, PAN Card, etc.</p>
                        <p className="text-xs text-gray-400 mt-2">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !citizenshipProofFile}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner size="small" /> : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Register;
