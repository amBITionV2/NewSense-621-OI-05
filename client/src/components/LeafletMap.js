import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import config from '../config';
import { MapPin, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LeafletMap = ({ onIssueClick, selectedIssue, className = '', isInteractive = true, sampleIssues = [], heatMapData = [], showHeatMap = false }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mountMap, setMountMap] = useState(false);

  // Category icons and colors
  const categoryConfig = {
    'potholes': { icon: '🕳️', color: '#ef4444', bgColor: '#fef2f2' },
    'garbage': { icon: '🗑️', color: '#f59e0b', bgColor: '#fffbeb' },
    'street-lighting': { icon: '💡', color: '#eab308', bgColor: '#fefce8' },
    'water-supply': { icon: '💧', color: '#3b82f6', bgColor: '#eff6ff' },
    'sewage': { icon: '🚰', color: '#8b5cf6', bgColor: '#faf5ff' },
    'traffic-signals': { icon: '🚦', color: '#f97316', bgColor: '#fff7ed' },
    'road-maintenance': { icon: '🛣️', color: '#64748b', bgColor: '#f8fafc' },
    'public-transport': { icon: '🚌', color: '#06b6d4', bgColor: '#ecfeff' },
    'parks-recreation': { icon: '🌳', color: '#10b981', bgColor: '#ecfdf5' },
    'noise-pollution': { icon: '🔊', color: '#f43f5e', bgColor: '#fdf2f8' },
    'air-pollution': { icon: '🌫️', color: '#6b7280', bgColor: '#f9fafb' },
    'other': { icon: '📋', color: '#374151', bgColor: '#f3f4f6' }
  };

  // Priority colors
  const priorityColors = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#f97316',
    'urgent': '#ef4444'
  };

  // Status colors
  const statusColors = {
    'open': '#f59e0b',
    'in-progress': '#3b82f6',
    'resolved': '#10b981',
    'closed': '#6b7280'
  };

  // Get current location or use defaults immediately to avoid prolonged null state
  useEffect(() => {
    if (sampleIssues.length > 0) {
      setCurrentLocation([12.9716, 77.5946]);
      return;
    }
    // set a fast default immediately
    setCurrentLocation([28.6139, 77.2090]);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // keep default
        },
        { timeout: 3000, maximumAge: 60000 }
      );
    }
  }, [sampleIssues]);

  // Fetch issues from API or use sample issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If sample issues are provided, use them instead of API
        if (sampleIssues.length > 0) {
          const formattedIssues = sampleIssues.map(issue => ({
            _id: issue.id.toString(),
            title: issue.title,
            description: issue.description,
            category: issue.category.toLowerCase().replace(/\s+/g, '-'),
            priority: issue.priority,
            status: issue.status,
            location: {
              coordinates: { lat: issue.location[0], lng: issue.location[1] },
              address: `${issue.category}, Bangalore, India`
            },
            createdAt: issue.reportedAt,
            reportedBy: issue.reportedBy,
            isReal: issue.isReal
          }));
          setIssues(formattedIssues);
          setError(null); // Remove the sample data message
        } else {
          const response = await axios.get(`${config.API_URL}/api/complaints/public`);
          setIssues(response.data.complaints || []);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
        // Set mock data for demo purposes when API fails
        setIssues([
          {
            _id: '1',
            title: 'Pothole on Main Road',
            description: 'Large pothole causing traffic issues and vehicle damage',
            category: 'potholes',
            priority: 'high',
            status: 'open',
            location: {
              coordinates: { lat: 28.6139, lng: 77.2090 },
              address: 'Main Road, Delhi, India'
            },
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            title: 'Garbage Collection Issue',
            description: 'Garbage not being collected for 3 days, causing health hazards',
            category: 'garbage',
            priority: 'medium',
            status: 'in-progress',
            location: {
              coordinates: { lat: 28.6145, lng: 77.2100 },
              address: 'Residential Area, Delhi, India'
            },
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: '3',
            title: 'Street Light Not Working',
            description: 'Street light has been out for a week, making area unsafe at night',
            category: 'street-lighting',
            priority: 'urgent',
            status: 'open',
            location: {
              coordinates: { lat: 28.6120, lng: 77.2080 },
              address: 'Park Street, Delhi, India'
            },
            createdAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            _id: '4',
            title: 'Water Supply Problem',
            description: 'No water supply for 2 days, affecting daily activities',
            category: 'water-supply',
            priority: 'high',
            status: 'resolved',
            location: {
              coordinates: { lat: 28.6150, lng: 77.2110 },
              address: 'Water Tank Area, Delhi, India'
            },
            createdAt: new Date(Date.now() - 259200000).toISOString()
          }
        ]);
        setError('Using demo data - Backend connection issue');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [sampleIssues]);

  // Create custom marker icon
  const createCustomIcon = (priority, category) => {
    const color = priorityColors[priority] || priorityColors['medium'];
    const categoryIcon = categoryConfig[category] || categoryConfig['other'];
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${categoryIcon.icon}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Map click handler for interactive maps
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isInteractive) {
          const { lat, lng } = e.latlng;
          setSelectedPosition([lat, lng]);
          if (onIssueClick) {
            onIssueClick({ lat, lng });
          }
        }
      }
    });
    return null;
  };

  // Defer map mount slightly to ensure layout is stable
  useEffect(() => {
    const timer = setTimeout(() => setMountMap(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // No size invalidation to avoid Leaflet pane errors during mount

  // Center map on selected issue
  useEffect(() => {
    if (selectedIssue && selectedIssue.location && selectedIssue.location.coordinates) {
      setSelectedPosition([
        selectedIssue.location.coordinates.lat,
        selectedIssue.location.coordinates.lng
      ]);
    }
  }, [selectedIssue]);

  if (!currentLocation) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error && !issues.length) {
    return (
      <div className={`flex items-center justify-center bg-yellow-50 rounded-lg border border-yellow-200 ${className}`}>
        <div className="text-center p-4">
          <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-yellow-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <style>{`
        .leaflet-popup {
          z-index: 10000 !important;
        }
        .leaflet-popup-content-wrapper {
          z-index: 10000 !important;
        }
        .leaflet-popup-tip {
          z-index: 10000 !important;
        }
        .custom-popup {
          z-index: 10000 !important;
        }
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-map-pane {
          z-index: 1 !important;
        }
        .leaflet-tile-pane {
          z-index: 1 !important;
        }
        .leaflet-overlay-pane {
          z-index: 2 !important;
        }
        .leaflet-marker-pane {
          z-index: 3 !important;
        }
        .leaflet-popup-pane {
          z-index: 10000 !important;
        }
      `}</style>
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-center">
          <p className="text-xs text-yellow-700">
            <AlertCircle className="inline h-3 w-3 mr-1" />
            {error}
          </p>
        </div>
      )}
      {mountMap && currentLocation && (
        <MapContainer
          center={currentLocation}
          zoom={sampleIssues.length > 0 ? 11 : 13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          scrollWheelZoom={false}
          zoomAnimation={false}
          doubleClickZoom={false}
          key={`${currentLocation[0]},${currentLocation[1]}`}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map click handler for interactive maps */}
        {isInteractive && <MapClickHandler />}
        
        {/* Selected position marker */}
        {selectedPosition && isInteractive && (
          <Marker position={selectedPosition}>
            <Popup>
              <div className="p-2">
                <p className="font-semibold text-blue-600">Selected Location</p>
                <p className="text-sm text-gray-600">
                  Lat: {selectedPosition[0].toFixed(6)}, Lng: {selectedPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Heat map circles */}
        {showHeatMap && heatMapData.map((heatPoint, index) => {
          const radius = Math.max(300, heatPoint.complaints * 25); // Much larger radius based on complaint count
          const opacity = heatPoint.intensity * 0.8;
          const color = priorityColors[heatPoint.priority] || priorityColors['medium'];
          
          return (
            <Circle
              key={`heat-${index}`}
              center={[heatPoint.lat, heatPoint.lng]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: opacity,
                weight: 4,
                opacity: opacity
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Complaint Density</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{heatPoint.complaints}</strong> complaints reported
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Priority: <span className="font-medium" style={{ color: color }}>
                      {heatPoint.priority.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Intensity: {(heatPoint.intensity * 100).toFixed(0)}%
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Issue markers - only show when heat map is off */}
        {!showHeatMap && issues.map((issue) => {
          if (!issue.location || !issue.location.coordinates) return null;
          
          const position = [issue.location.coordinates.lat, issue.location.coordinates.lng];
          const icon = createCustomIcon(issue.priority, issue.category);
          
          return (
            <Marker
              key={issue._id}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onIssueClick) {
                    onIssueClick(issue);
                  }
                }
              }}
            >
              <Popup className="custom-popup" style={{ zIndex: 10000 }}>
                <div className="p-3 max-w-xs">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: categoryConfig[issue.category]?.bgColor }}
                      >
                        {categoryConfig[issue.category]?.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${statusColors[issue.status]}20`, 
                            color: statusColors[issue.status] 
                          }}
                        >
                          {issue.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${priorityColors[issue.priority]}20`, 
                            color: priorityColors[issue.priority] 
                          }}
                        >
                          {issue.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Reported by: {issue.reportedBy || 'Anonymous'}
                      </div>
                      <button 
                        onClick={() => onIssueClick && onIssueClick(issue)}
                        className="w-full text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        </MapContainer>
      )}
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {showHeatMap ? 'Heat Map Legend' : 'Issue Priority Legend'}
        </h3>
        <div className="space-y-2">
          {showHeatMap ? (
            <>
              <div className="text-xs text-gray-500 mb-2">Complaint Density</div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-500 opacity-80"></div>
                <span className="text-xs text-gray-600">High Density (15+ complaints)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 opacity-70"></div>
                <span className="text-xs text-gray-600">Medium Density (8-14 complaints)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-60"></div>
                <span className="text-xs text-gray-600">Low Density (4-7 complaints)</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="text-xs text-gray-500">Click circles for details</div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">Urgent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="text-xs text-gray-500">Click markers for details</div>
            </>
          )}
        </div>
      </div>

      {/* Current Location Button */}
      {currentLocation && (
        <button
          onClick={() => {
            // This would center the map on current location
            // Implementation depends on how you want to handle this
          }}
          className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
          title="Center on current location"
        >
          <MapPin className="h-5 w-5 text-blue-600" />
        </button>
      )}
    </div>
  );
};

export default LeafletMap;
