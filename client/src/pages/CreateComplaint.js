import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import { 
  MapPin, 
  Camera, 
  X, 
  Loader
} from 'lucide-react';

const CreateComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    { 
      value: 'potholes', 
      label: 'Potholes',
      description: 'Report damaged road surfaces, potholes, cracks, or uneven pavement that pose safety risks to vehicles and pedestrians. Include location details and severity of damage.'
    },
    { 
      value: 'garbage', 
      label: 'Garbage Collection',
      description: 'Report issues with waste collection services, overflowing bins, improper disposal, or areas where garbage is not being collected regularly. Help keep our city clean.'
    },
    { 
      value: 'street-lighting', 
      label: 'Street Lighting',
      description: 'Report non-functioning street lights, dim lighting, or areas that need additional lighting for safety. Poor lighting can lead to accidents and security concerns.'
    },
    { 
      value: 'water-supply', 
      label: 'Water Supply',
      description: 'Report water supply issues including low pressure, contaminated water, pipe leaks, or areas without proper water access. Essential for public health and daily living.'
    },
    { 
      value: 'sewage', 
      label: 'Sewage Issues',
      description: 'Report blocked drains, sewage overflow, foul odors, or drainage problems that affect hygiene and public health. These issues require immediate attention.'
    },
    { 
      value: 'traffic-signals', 
      label: 'Traffic Signals',
      description: 'Report malfunctioning traffic lights, missing signals, or poorly timed signals that cause traffic congestion or safety hazards at intersections.'
    },
    { 
      value: 'road-maintenance', 
      label: 'Road Maintenance',
      description: 'Report general road maintenance issues like faded road markings, damaged signage, missing guardrails, or road construction problems.'
    },
    { 
      value: 'public-transport', 
      label: 'Public Transport',
      description: 'Report issues with buses, trains, metro services, bus stops, or public transport infrastructure that affect daily commuters and accessibility.'
    },
    { 
      value: 'parks-recreation', 
      label: 'Parks & Recreation',
      description: 'Report problems in public parks, playgrounds, sports facilities, or recreational areas including damaged equipment, poor maintenance, or safety concerns.'
    },
    { 
      value: 'noise-pollution', 
      label: 'Noise Pollution',
      description: 'Report excessive noise from construction, traffic, industrial activities, or other sources that disturb residents and affect quality of life.'
    },
    { 
      value: 'air-pollution', 
      label: 'Air Pollution',
      description: 'Report sources of air pollution including industrial emissions, vehicle exhaust, burning waste, or other activities that degrade air quality.'
    },
    { 
      value: 'other', 
      label: 'Other Issues',
      description: 'Report any other civic issues not covered by the above categories. Provide detailed description of the problem and its impact on the community.'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (window.google && window.google.maps) {
        const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
        
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: defaultLocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        // Add click listener to map
        mapInstance.addListener('click', (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { lat, lng }
            }
          }));

          // Update marker
          if (marker) {
            marker.setPosition({ lat, lng });
          } else {
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              draggable: true,
            });
            setMarker(newMarker);

            // Add drag listener
            newMarker.addListener('dragend', (event) => {
              const newLat = event.latLng.lat();
              const newLng = event.latLng.lng();
              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  coordinates: { lat: newLat, lng: newLng }
                }
              }));
            });
          }

          // Reverse geocoding
          reverseGeocode(lat, lng);
        });

        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              setCurrentLocation({ lat, lng });
              mapInstance.setCenter({ lat, lng });
            },
            (error) => {
              console.error('Error getting current location:', error);
            }
          );
        }
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const reverseGeocode = (lat, lng) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address
            }
          }));
        }
      });
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files were invalid. Only images and videos under 10MB are allowed.');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const useCurrentLocation = () => {
    if (currentLocation && map) {
      map.setCenter(currentLocation);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: currentLocation
        }
      }));

      if (marker) {
        marker.setPosition(currentLocation);
      } else {
        const newMarker = new window.google.maps.Marker({
          position: currentLocation,
          map: map,
          draggable: true,
        });
        setMarker(newMarker);
      }

      reverseGeocode(currentLocation.lat, currentLocation.lng);
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

    if (!formData.location.coordinates.lat || !formData.location.coordinates.lng) {
      newErrors.location = 'Please select a location on the map';
    }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-visible">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Report a Civic Issue
            </h1>
            <p className="text-gray-600">
              Help improve your community by reporting issues that need attention.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input-field px-3 ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Brief description of the issue"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative overflow-visible">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map(category => (
                      <div
                        key={category.value}
                        className="relative"
                        style={{ zIndex: hoveredCategory === category.value ? 100 : 1 }}
                        onMouseEnter={() => setHoveredCategory(category.value)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <label className={`block cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 ${
                          formData.category === category.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : hoveredCategory === category.value
                            ? 'border-blue-400 bg-blue-50 text-blue-600 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                        }`}>
                          <input
                            type="radio"
                            name="category"
                            value={category.value}
                            checked={formData.category === category.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="font-medium text-sm">{category.label}</div>
                        </label>
                        
                        {/* Enhanced Tooltip */}
                        {hoveredCategory === category.value && (
                          <div className="fixed z-[9999] w-80 p-4 mt-2 bg-gray-900 text-white text-sm rounded-lg shadow-2xl left-1/2 transform -translate-x-1/2 top-full border-2 border-gray-700 pointer-events-none">
                            <div className="text-center">
                              <div className="font-semibold text-gray-300 mb-2">{category.label}</div>
                              <div className="leading-relaxed text-gray-200">{category.description}</div>
                            </div>
                            {/* Arrow pointing up */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45 border-l border-t border-gray-700"></div>
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
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`input-field px-3 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Provide detailed information about the issue, including when you noticed it, how it affects the community, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="flex flex-wrap gap-2">
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      formData.priority === priority.value 
                        ? priority.color 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {priority.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Click on the map to mark the exact location of the issue
                  </p>
                  {currentLocation && (
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      className="btn-secondary text-sm"
                    >
                      <MapPin size={16} className="inline mr-1" />
                      Use Current Location
                    </button>
                  )}
                </div>
                
                <div className="map-container" ref={mapRef}></div>
                
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`input-field px-3 ${errors.address ? 'border-red-500' : ''}`}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos/Videos (Optional)
              </label>
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer"
                >
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Click to upload photos or videos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
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
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin inline mr-2" size={16} />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
