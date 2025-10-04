import React from 'react';
import { X, MapPin, Calendar, User, AlertCircle, Clock, CheckCircle, XCircle, Camera, Video } from 'lucide-react';

const IssueDetailsModal = ({ issue, isOpen, onClose }) => {
  if (!isOpen || !issue) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'potholes': '🕳️',
      'garbage': '🗑️',
      'street-lighting': '💡',
      'water-supply': '💧',
      'sewage': '🚰',
      'traffic-signals': '🚦',
      'road-maintenance': '🛣️',
      'public-transport': '🚌',
      'parks-recreation': '🌳',
      'noise-pollution': '🔊',
      'air-pollution': '🌫️',
      'other': '📋'
    };
    return icons[category] || '📋';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'potholes': 'Potholes',
      'garbage': 'Garbage Collection',
      'street-lighting': 'Street Lighting',
      'water-supply': 'Water Supply',
      'sewage': 'Sewage Issues',
      'traffic-signals': 'Traffic Signals',
      'road-maintenance': 'Road Maintenance',
      'public-transport': 'Public Transport',
      'parks-recreation': 'Parks & Recreation',
      'noise-pollution': 'Noise Pollution',
      'air-pollution': 'Air Pollution',
      'other': 'Other Issues'
    };
    return labels[category] || 'Other Issues';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{issue.title}</h2>
              <p className="text-sm text-gray-600">{getCategoryLabel(issue.category)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
              {getStatusIcon(issue.status)}
              <span className="ml-1">{issue.status.replace('-', ' ').toUpperCase()}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
              {issue.priority.toUpperCase()} PRIORITY
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Location */}
          {issue.location && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Location
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{issue.location.address}</p>
                {issue.location.city && issue.location.state && (
                  <p className="text-sm text-gray-600 mt-1">
                    {issue.location.city}, {issue.location.state}
                    {issue.location.pincode && ` - ${issue.location.pincode}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Media */}
          {(issue.images && issue.images.length > 0) || (issue.videos && issue.videos.length > 0) ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.images && issue.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Issue image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                ))}
                {issue.videos && issue.videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <video
                      src={video.url}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                    <div className="absolute top-2 right-2">
                      <Video className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Updates */}
          {issue.updates && issue.updates.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Updates</h3>
              <div className="space-y-3">
                {issue.updates.map((update, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                        {getStatusIcon(update.status)}
                        <span className="ml-1">{update.status.replace('-', ' ').toUpperCase()}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(update.updatedAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{update.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Reported: {formatDate(issue.createdAt)}</span>
              </div>
              {issue.user && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>By: {issue.user.name || 'Anonymous'}</span>
                </div>
              )}
              {issue.estimatedResolution && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Estimated Resolution: {formatDate(issue.estimatedResolution)}</span>
                </div>
              )}
              {issue.actualResolution && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Resolved: {formatDate(issue.actualResolution)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Navigate to full complaint details page
              window.open(`/complaints/${issue._id}`, '_blank');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsModal;
