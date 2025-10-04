import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LeafletMap from '../components/LeafletMap';
import { 
  MapPin, 
  Camera, 
  X, 
  Loader,
  Mic
} from 'lucide-react';

// Define SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' }
];

const categoryColors = {
  potholes: 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 border-yellow-400',
  garbage: 'bg-gradient-to-br from-green-200 via-green-400 to-green-600 border-green-400',
  'street-lighting': 'bg-gradient-to-br from-indigo-200 via-indigo-400 to-indigo-600 border-indigo-400',
  'water-supply': 'bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 border-blue-400',
  sewage: 'bg-gradient-to-br from-purple-200 via-purple-400 to-purple-600 border-purple-400',
  'traffic-signals': 'bg-gradient-to-br from-red-200 via-red-400 to-red-600 border-red-400',
  'road-maintenance': 'bg-gradient-to-br from-orange-200 via-orange-400 to-orange-600 border-orange-400',
  'public-transport': 'bg-gradient-to-br from-teal-200 via-teal-400 to-teal-600 border-teal-400',
  'parks-recreation': 'bg-gradient-to-br from-pink-200 via-pink-400 to-pink-600 border-pink-400',
  'noise-pollution': 'bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 border-gray-400',
  'air-pollution': 'bg-gradient-to-br from-lime-200 via-lime-400 to-lime-600 border-lime-400',
  other: 'bg-gradient-to-br from-fuchsia-200 via-fuchsia-400 to-fuchsia-600 border-fuchsia-400',
};

const categoryIcons = {
  potholes: <span role="img" aria-label="Potholes" className="text-3xl">🕳️</span>,
  garbage: <span role="img" aria-label="Garbage" className="text-3xl">🗑️</span>,
  'street-lighting': <span role="img" aria-label="Street Lighting" className="text-3xl">💡</span>,
  'water-supply': <span role="img" aria-label="Water Supply" className="text-3xl">🚰</span>,
  sewage: <span role="img" aria-label="Sewage" className="text-3xl">🦠</span>,
  'traffic-signals': <span role="img" aria-label="Traffic Signals" className="text-3xl">🚦</span>,
  'road-maintenance': <span role="img" aria-label="Road Maintenance" className="text-3xl">🛣️</span>,
  'public-transport': <span role="img" aria-label="Public Transport" className="text-3xl">🚌</span>,
  'parks-recreation': <span role="img" aria-label="Parks & Recreation" className="text-3xl">🏞️</span>,
  'noise-pollution': <span role="img" aria-label="Noise Pollution" className="text-3xl">🔊</span>,
  'air-pollution': <span role="img" aria-label="Air Pollution" className="text-3xl">🌫️</span>,
  other: <span role="img" aria-label="Other" className="text-3xl">❓</span>,
};

const CreateComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    language: 'en',
    location: {
      address: '',
      coordinates: { lat: null, lng: null },
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDesc, setIsListeningDesc] = useState(false);

  const categories = [
    { value: 'potholes', label: 'Potholes', description: 'Report damaged road surfaces, potholes, cracks, or uneven pavement that pose safety risks to vehicles and pedestrians. Include location details and severity of damage.' },
    { value: 'garbage', label: 'Garbage Collection', description: 'Report issues with waste collection services, overflowing bins, improper disposal, or areas where garbage is not being collected regularly. Help keep our city clean.' },
    { value: 'street-lighting', label: 'Street Lighting', description: 'Report non-functioning street lights, dim lighting, or areas that need additional lighting for safety. Poor lighting can lead to accidents and security concerns.' },
    { value: 'water-supply', label: 'Water Supply', description: 'Report water supply issues including low pressure, contaminated water, pipe leaks, or areas without proper water access. Essential for public health and daily living.' },
    { value: 'sewage', label: 'Sewage Issues', description: 'Report blocked drains, sewage overflow, foul odors, or drainage problems that affect hygiene and public health. These issues require immediate attention.' },
    { value: 'traffic-signals', label: 'Traffic Signals', description: 'Report malfunctioning traffic lights, missing signals, or poorly timed signals that cause traffic congestion or safety hazards at intersections.' },
    { value: 'road-maintenance', label: 'Road Maintenance', description: 'Report general road maintenance issues like faded road markings, damaged signage, missing guardrails, or road construction problems.' },
    { value: 'public-transport', label: 'Public Transport', description: 'Report issues with buses, trains, metro services, bus stops, or public transport infrastructure that affect daily commuters and accessibility.' },
    { value: 'parks-recreation', label: 'Parks & Recreation', description: 'Report problems in public parks, playgrounds, sports facilities, or recreational areas including damaged equipment, poor maintenance, or safety concerns.' },
    { value: 'noise-pollution', label: 'Noise Pollution', description: 'Report excessive noise from construction, traffic, industrial activities, or other sources that disturb residents and affect quality of life.' },
    { value: 'air-pollution', label: 'Air Pollution', description: 'Report sources of air pollution including industrial emissions, vehicle exhaust, burning waste, or other activities that degrade air quality.' },
    { value: 'other', label: 'Other Issues', description: 'Report any other civic issues not covered by the above categories. Provide detailed description of the problem and its impact on the community.' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  // Handle map location selection
  const handleLocationSelect = (location) => {
    if (location.lat && location.lng) {
      setSelectedLocation([location.lat, location.lng]);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: { lat: location.lat, lng: location.lng }
        }
      }));
      
      // Simple reverse geocoding using a free service
      reverseGeocode(location.lat, location.lng);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            address: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village || '',
            state: data.address?.state || '',
            pincode: data.address?.postcode || ''
          }
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Set a basic address if reverse geocoding fails
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
        }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Voice-to-text for title
  const handleVoiceInputTitle = () => {
    if (!SpeechRecognition) {
      toast.error('Speech Recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = formData.language === 'en' ? 'en-US' : (formData.language === 'hi' ? 'hi-IN' : 'kn-IN');
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListeningTitle(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, title: prev.title + ' ' + transcript }));
      setIsListeningTitle(false);
    };
    recognition.onerror = (event) => {
      toast.error('Voice input error: ' + event.error);
      setIsListeningTitle(false);
    };
    recognition.onend = () => {
      setIsListeningTitle(false);
    };
  };

  // Voice-to-text for description
  const handleVoiceInputDesc = () => {
    if (!SpeechRecognition) {
      toast.error('Speech Recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = formData.language === 'en' ? 'en-US' : (formData.language === 'hi' ? 'hi-IN' : 'kn-IN');
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListeningDesc(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, description: prev.description + ' ' + transcript }));
      setIsListeningDesc(false);
    };
    recognition.onerror = (event) => {
      toast.error('Voice input error: ' + event.error);
      setIsListeningDesc(false);
    };
    recognition.onend = () => {
      setIsListeningDesc(false);
    };
  };

  // File input handler
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedLocation([lat, lng]);
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { lat, lng }
            }
          }));
          reverseGeocode(lat, lng);
        },
        (error) => {
          console.error('Error getting current location:', error);
          toast.error('Unable to get your current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Require location coordinates
    if (!formData.location.coordinates.lat || !formData.location.coordinates.lng) {
      newErrors.location = 'Please select a location on the map';
    }

    // Require address
    if (!formData.location.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Add form data
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      submitData.append('location', JSON.stringify(formData.location));

      // Add files
      files.forEach((file, index) => {
        submitData.append('media', file);
      });

      const response = await axios.post('/api/complaints', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Complaint submitted successfully!');
      navigate(`/complaints/${response.data.complaint._id}`);
    } catch (error) {
      console.error('Submit error:', error);
      const message = error.response?.data?.message || 'Failed to submit complaint';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Animation helpers
  const cardHover = "transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl";
  const inputFocus = "focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200";
  const btnPrimary = "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:scale-105 hover:shadow-lg transition-all duration-200";
  const btnSecondary = "bg-gray-100 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-200 transition-all duration-200";
  const micPulse = "animate-pulse";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-8 overflow-visible ${cardHover}`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 tracking-tight drop-shadow">
              Report a Civic Issue
            </h1>
            <p className="text-gray-600 text-lg">
              Help improve your community by reporting issues that need attention.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title and Language Selection Row */}
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-1">
                <label htmlFor="title" className="block text-base font-semibold text-gray-700 mb-2">
                  Issue Title *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-lg ${inputFocus} ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Brief description of the issue"
                  />
                  <button
                    type="button"
                    onClick={handleVoiceInputTitle}
                    disabled={isListeningTitle}
                    className={`p-2 rounded-full border border-blue-300 bg-blue-50 hover:bg-blue-200 transition-colors ${isListeningTitle ? micPulse : ''}`}
                    title="Voice to Text"
                  >
                    <Mic size={22} className={isListeningTitle ? 'text-blue-600' : 'text-blue-500'} />
                  </button>
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              <div className="w-full md:w-56">
                <label htmlFor="language" className="block text-base font-semibold text-gray-700 mb-2">
                  Select Language *
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className={`input-field px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-lg ${inputFocus}`}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative overflow-visible">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {categories.map(category => (
                    <div
                      key={category.value}
                      className={`relative flex flex-col items-center justify-center h-40 w-full rounded-xl shadow-lg border-2 transition-transform duration-300 cursor-pointer ${categoryColors[category.value]} ${formData.category === category.value ? 'scale-105 border-4' : 'hover:scale-105'} ${hoveredCategory === category.value ? 'z-10' : ''}`}
                      style={{ zIndex: hoveredCategory === category.value ? 100 : 1 }}
                      onMouseEnter={() => setHoveredCategory(category.value)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="mb-2">{categoryIcons[category.value]}</div>
                        <div className="font-bold text-base text-white drop-shadow">{category.label}</div>
                      </label>
                      {/* Tooltip */}
                      {hoveredCategory === category.value && (
                        <div className="fixed z-[9999] w-80 p-4 mt-2 bg-white text-indigo-900 text-sm rounded-xl shadow-2xl left-1/2 transform -translate-x-1/2 top-full border-2 border-indigo-700 pointer-events-none animate-fade-in">
                          <div className="text-center">
                            <div className="font-semibold text-indigo-700 mb-2">{category.label}</div>
                            <div className="leading-relaxed text-indigo-800">{category.description}</div>
                          </div>
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-indigo-700"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Description with voice-to-text */}
            <div>
              <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-2">
                Detailed Description *
              </label>
              <div className="flex items-center gap-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`input-field px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-lg ${inputFocus} ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Provide detailed information about the issue, including when you noticed it, how it affects the community, etc."
                />
                <button
                  type="button"
                  onClick={handleVoiceInputDesc}
                  disabled={isListeningDesc}
                  className={`p-2 rounded-full border border-blue-300 bg-blue-50 hover:bg-blue-200 transition-colors ${isListeningDesc ? micPulse : ''}`}
                  title="Voice to Text"
                >
                  <Mic size={22} className={isListeningDesc ? 'text-blue-600' : 'text-blue-500'} />
                </button>
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="flex flex-wrap gap-3">
                {priorities.map(priority => (
                  <label key={priority.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`px-4 py-1 rounded-full text-base font-semibold cursor-pointer transition-colors duration-200 ${
                      formData.priority === priority.value 
                        ? priority.color 
                        : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'
                    }`}>
                      {priority.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <p className="text-sm text-gray-600">
                     Click on the map to mark the exact location of the issue
                   </p>
                   <button
                     type="button"
                     onClick={useCurrentLocation}
                     className={btnSecondary}
                   >
                     <MapPin size={18} className="inline mr-1" />
                     Use Current Location
                   </button>
                 </div>
                 <div className="map-container rounded-xl border border-indigo-200 overflow-hidden" style={{ height: '400px' }}>
                   <LeafletMap 
                     onIssueClick={handleLocationSelect}
                     selectedIssue={selectedLocation ? { location: { coordinates: { lat: selectedLocation[0], lng: selectedLocation[1] } } } : null}
                     isInteractive={true}
                     className="h-full w-full"
                   />
                 </div>
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}
                <div>
                  <label htmlFor="address" className="block text-base font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    className={`input-field px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-lg ${inputFocus} ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="Address will be auto-filled when you click on the map"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Photos/Videos (Optional)
              </label>
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors duration-200 cursor-pointer bg-indigo-50 hover:bg-indigo-100"
                >
                  <Camera className="mx-auto h-14 w-14 text-indigo-400" />
                  <div className="mt-2">
                    <p className="text-base text-indigo-700">
                      Click to upload photos or videos
                    </p>
                    <p className="text-xs text-indigo-500 mt-1">
                      PNG, JPG, MP4 up to 10MB each
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {files.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-indigo-100 rounded-xl overflow-hidden shadow group-hover:scale-105 transition-transform duration-200">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className={btnSecondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${btnPrimary} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin inline mr-2" size={18} />
                    Submitting...
                  </>
                ) : (
                  <span className="transition-transform duration-200 group-hover:scale-105">Submit Complaint</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Animation for tooltips */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease;
        }
      `}</style>
    </div>
  );
};

export default CreateComplaint;