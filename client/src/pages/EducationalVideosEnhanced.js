import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Clock, Users, ThumbsUp, Share2, Sparkles, Target, Lightbulb, Heart, Star, Filter, Search, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EducationalVideosEnhanced = () => {
  const [videos, setVideos] = useState([]);
  const [civicVideos, setCivicVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [civicLoading, setCivicLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📚' },
    { value: 'civic-responsibility', label: 'Civic Responsibility', icon: '🗳️' },
    { value: 'environmental-awareness', label: 'Environmental Awareness', icon: '🌱' },
    { value: 'traffic-rules', label: 'Traffic Rules', icon: '🚦' },
    { value: 'waste-management', label: 'Waste Management', icon: '♻️' },
    { value: 'public-safety', label: 'Public Safety', icon: '🛡️' },
    { value: 'community-service', label: 'Community Service', icon: '🤝' },
    { value: 'digital-citizenship', label: 'Digital Citizenship', icon: '💻' },
    { value: 'health-hygiene', label: 'Health & Hygiene', icon: '🏥' }
  ];

  useEffect(() => {
    fetchVideos();
    if (activeTab === 'civic') {
      fetchCivicVideos();
    }
  }, [selectedCategory, activeTab]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await axios.get('/api/ai/videos', { params });
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCivicVideos = async () => {
    try {
      setCivicLoading(true);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await axios.get('/api/ai/civic-videos', { params });
      setCivicVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching civic videos:', error);
    } finally {
      setCivicLoading(false);
    }
  };

  const generateCivicVideo = async (category) => {
    try {
      setCivicLoading(true);
      await axios.post('/api/ai/generate-civic-video', { category });
      await fetchCivicVideos();
    } catch (error) {
      console.error('Error generating civic video:', error);
    } finally {
      setCivicLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading && activeTab === 'all') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const filteredVideos = activeTab === 'civic' ? civicVideos : videos;
  const currentLoading = activeTab === 'civic' ? civicLoading : loading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Enhanced Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Educational Videos</h1>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about civic responsibility, environmental awareness, and community engagement through AI-generated educational content.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>All Videos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('civic')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'civic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Civic Sense Videos</span>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => activeTab === 'civic' ? fetchCivicVideos() : fetchVideos()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Civic Sense Video Generation Section */}
      {activeTab === 'civic' && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  AI-Generated Civic Sense Videos
                </h2>
                <p className="text-blue-100">
                  Generate educational videos about civic responsibility using Gemini Veo AI technology
                </p>
              </div>
              <button
                onClick={() => generateCivicVideo(selectedCategory === 'all' ? 'civic-responsibility' : selectedCategory)}
                disabled={civicLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                {civicLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{civicLoading ? 'Generating...' : 'Generate Video'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      <div className="container mx-auto px-4">
        {/* Videos Grid */}
        {currentLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos available</h3>
            <p className="text-gray-600">
              {activeTab === 'civic' 
                ? 'Generate civic sense videos using AI technology.' 
                : 'Check back later for new educational content.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <div key={video._id} className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md ${
                video.generationMethod === 'gemini-veo' 
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50' 
                  : 'border-gray-200'
              }`}>
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gray-100 relative">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                  {video.generationMethod === 'gemini-veo' && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Generated</span>
                    </div>
                  )}
                </div>

                {/* Video Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                    {video.generationMethod === 'gemini-veo' && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  
                  {/* Learning Objectives for Civic Videos */}
                  {video.learningObjectives && video.learningObjectives.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">Learning Objectives</span>
                      </div>
                      <div className="space-y-1">
                        {video.learningObjectives.slice(0, 2).map((objective, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span className="line-clamp-1">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practical Tips for Civic Videos */}
                  {video.practicalTips && video.practicalTips.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-600">Practical Tips</span>
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {video.practicalTips.slice(0, 2).join(' • ')}
                      </div>
                    </div>
                  )}

                  {/* Video Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{video.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{video.likes || 0}</span>
                      </div>
                      {video.feedback && video.feedback.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{video.feedback.length}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Call to Action for Civic Videos */}
                  {video.callToAction && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-1 mb-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-blue-600">Take Action</span>
                      </div>
                      <p className="text-xs text-blue-700 line-clamp-2">{video.callToAction}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalVideosEnhanced;
