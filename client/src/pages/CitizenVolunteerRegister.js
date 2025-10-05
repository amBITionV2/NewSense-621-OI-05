import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Users,
  Clock,
  Award,
  Star
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CitizenVolunteerRegister = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Volunteer-specific information only
    skills: [],
    interests: [],
    experience: 'beginner',
    availability: {
      weekdays: true,
      weekends: true,
      timeSlots: []
    },
    
    // Emergency Contact (only if not already in user profile)
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Preferences
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      taskTypes: [],
      maxDistance: 10
    }
  });

  const [errors, setErrors] = useState({});

  const skillOptions = [
    'Communication', 'Teaching', 'Healthcare', 'Technology', 'Construction',
    'Cooking', 'Driving', 'First Aid', 'Language Translation', 'Event Management',
    'Social Work', 'Counseling', 'Fundraising', 'Administration', 'Other'
  ];

  const interestOptions = [
    'Community Service', 'Education', 'Healthcare', 'Environment', 'Disaster Relief',
    'Social Work', 'Healthcare', 'Women Empowerment', 'Child Welfare', 'Senior Care',
    'Animal Welfare', 'Sports', 'Arts & Culture', 'Technology', 'Other'
  ];

  const taskTypeOptions = [
    'community_service', 'education', 'healthcare', 'environment', 
    'disaster_relief', 'social_work', 'other'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field, value, action) => {
    setFormData(prev => {
      try {
        if (field.includes('.')) {
          // Handle nested fields like 'preferences.taskTypes'
          const [parent, child] = field.split('.');
          const currentArray = Array.isArray(prev[parent]?.[child]) ? prev[parent][child] : [];
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: action === 'add' 
                ? [...currentArray, value]
                : currentArray.filter(item => item !== value)
            }
          };
        } else {
          // Handle top-level fields
          const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
          return {
            ...prev,
            [field]: action === 'add' 
              ? [...currentArray, value]
              : currentArray.filter(item => item !== value)
          };
        }
      } catch (error) {
        console.error('Error in handleArrayChange:', error, { field, value, action, prev });
        return prev; // Return unchanged state on error
      }
    });
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.skills || formData.skills.length === 0) newErrors.skills = 'Please select at least one skill';
      if (!formData.interests || formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    }
    
    if (stepNumber === 2) {
      // Emergency contact validation (optional)
      if (formData.emergencyContact.name.trim() && !formData.emergencyContact.relationship.trim()) {
        newErrors['emergencyContact.relationship'] = 'Relationship is required if emergency contact name is provided';
      }
      if (formData.emergencyContact.name.trim() && !formData.emergencyContact.phone.trim()) {
        newErrors['emergencyContact.phone'] = 'Emergency contact phone is required if emergency contact name is provided';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/api/volunteers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          // Include user's existing data
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          aadhaarNumber: user.aadhaarNumber,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          // Include volunteer-specific data
          ...formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update user role in context
        await updateProfile({ role: 'volunteer' });
        
        navigate('/dashboard', { 
          state: { 
            message: 'Successfully registered as a volunteer! You can now access volunteer features.' 
          } 
        });
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Profile</h2>
        <p className="text-gray-600">Tell us about your skills and interests</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Skills * (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleArrayChange('skills', skill, 
                  (formData.skills || []).includes(skill) ? 'remove' : 'add'
                )}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  (formData.skills || []).includes(skill)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Interests * (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleArrayChange('interests', interest, 
                  (formData.interests || []).includes(interest) ? 'remove' : 'add'
                )}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  (formData.interests || []).includes(interest)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Task Types
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {taskTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleArrayChange('preferences.taskTypes', type, 
                  (formData.preferences?.taskTypes || []).includes(type) ? 'remove' : 'add'
                )}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  (formData.preferences?.taskTypes || []).includes(type)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Distance (km)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.preferences.maxDistance}
            onChange={(e) => handleInputChange('preferences.maxDistance', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contact (Optional)</h2>
        <p className="text-gray-600">Additional emergency contact information (optional)</p>
      </div>

      {/* Show user's existing information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Your Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div><strong>Name:</strong> {user?.name}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Phone:</strong> {user?.phone}</div>
          {user?.aadhaarNumber && <div><strong>Aadhaar:</strong> {user.aadhaarNumber}</div>}
          {user?.dateOfBirth && <div><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</div>}
          {user?.gender && <div><strong>Gender:</strong> {user.gender}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors['emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Emergency contact name"
            />
          </div>
          {errors['emergencyContact.name'] && <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.name']}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship
          </label>
          <select
            value={formData.emergencyContact.relationship}
            onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors['emergencyContact.relationship'] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Relationship</option>
            <option value="spouse">Spouse</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="child">Child</option>
            <option value="friend">Friend</option>
            <option value="other">Other</option>
          </select>
          {errors['emergencyContact.relationship'] && <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.relationship']}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors['emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Emergency contact phone"
            />
          </div>
          {errors['emergencyContact.phone'] && <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.phone']}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.emergencyContact.email}
              onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Emergency contact email"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Become a Volunteer
            </h1>
            <p className="text-gray-600 mt-2">
              Join our volunteer community and make a difference in your neighborhood
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Welcome, {user?.name}!</strong> You're registering as a volunteer using your existing citizen account. 
                Your profile information (name, email, phone, Aadhaar, etc.) will be automatically used for volunteer registration.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                  </div>
                  {stepNumber < 2 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-sm text-gray-600">
                Step {step} of 2: {step === 1 ? 'Volunteer Profile' : 'Emergency Contact'}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    step === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Complete Registration
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600 text-sm">Make a real difference in your community</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Development</h3>
              <p className="text-gray-600 text-sm">Gain valuable experience and skills</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
              <p className="text-gray-600 text-sm">Volunteer on your own time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenVolunteerRegister;
