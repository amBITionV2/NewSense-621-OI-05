import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Video,
  Languages,
  Star,
  Zap,
  Heart,
  Sparkles,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Droplets
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  
  
  const [stats, setStats] = useState({
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
    recentComplaints: []
  });
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const dashboardRef = useRef(null);

  // Get personalized greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => observer.disconnect();
  }, [stats]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const animateValue = (start, end, setter) => {
      let current = start;
      const increment = (end - start) / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        setter(Math.floor(current));
      }, stepDuration);
    };

    animateValue(0, stats.totalComplaints, (value) => 
      setAnimatedStats(prev => ({ ...prev, totalComplaints: value }))
    );
    animateValue(0, stats.openComplaints, (value) => 
      setAnimatedStats(prev => ({ ...prev, openComplaints: value }))
    );
    animateValue(0, stats.resolvedComplaints, (value) => 
      setAnimatedStats(prev => ({ ...prev, resolvedComplaints: value }))
    );
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/complaints');
      const complaints = response.data.complaints;
      
      const totalComplaints = complaints.length;
      const openComplaints = complaints.filter(c => ['open', 'in-progress'].includes(c.status)).length;
      const resolvedComplaints = complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
      
      setStats({
        totalComplaints,
        openComplaints,
        resolvedComplaints,
        recentComplaints: complaints.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      default: return 'priority-medium';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your community. Let's make it better together! ✨
          </p>
        </div>

        {/* Quick Actions with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link
            to="/complaints/create"
            className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
            style={{animationDelay: '0.1s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">Report Issue</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">Submit a new complaint</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
            </div>
          </Link>

          <Link
            to="/videos"
            className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
            style={{animationDelay: '0.2s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Video className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-300">Learn</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">Educational videos</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Star className="w-5 h-5 text-yellow-500 animate-bounce" />
            </div>
          </Link>

          <Link
            to="/translation"
            className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
            style={{animationDelay: '0.3s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Languages className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors duration-300">Translate</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">AI translation tool</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
            </div>
          </Link>

          <Link
            to="/community"
            className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50"
            style={{animationDelay: '0.4s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">Community</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">Join discussions</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Heart className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
          </Link>
        </div>


        {/* User Profile Card with Weather */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user?.name || 'Citizen'}</h3>
                  <p className="text-gray-600 capitalize">{user?.role || 'citizen'} • {user?.location?.city || 'Your City'}</p>
                  <p className="text-sm text-gray-500">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last active</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Weather</h3>
              <Sun className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">24°C</p>
                <p className="text-blue-100">Sunny</p>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span>Feels like 26°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4" />
                  <span>Humidity 65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Animated Counters */}
        <div ref={dashboardRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Complaints</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {animatedStats.totalComplaints}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span>All time reports</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Open Issues</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {animatedStats.openComplaints}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                <span>Needs attention</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolved</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {animatedStats.resolvedComplaints}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                <span>Successfully fixed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Resolved Today</p>
            <p className="text-xl font-bold text-gray-900">3</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Avg. Response</p>
            <p className="text-xl font-bold text-gray-900">2.4h</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Community</p>
            <p className="text-xl font-bold text-gray-900">1.2k</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Your Rating</p>
            <p className="text-xl font-bold text-gray-900">4.8</p>
          </div>
        </div>

        {/* Recent Complaints with Modern Design */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Recent Complaints</h2>
              <Link
                to="/complaints"
                className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
              >
                <span>View all</span>
                <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="p-8">
            {stats.recentComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No complaints yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Start by reporting an issue in your community and help make it a better place for everyone.</p>
                <Link
                  to="/complaints/create"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Report Your First Issue</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.recentComplaints.map((complaint, index) => (
                  <div 
                    key={complaint._id} 
                    className="group relative overflow-hidden bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-200/50"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">{complaint.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('-', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{complaint.description.substring(0, 120)}...</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            {complaint.location.address}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/complaints/${complaint._id}`}
                        className="group/link flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                      >
                        <span>View Details</span>
                        <TrendingUp className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications and Updates */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Educational Content */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                <h3 className="text-2xl font-bold">Today's Learning</h3>
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                Discover daily educational content about civic responsibility and community awareness. 
                Learn how to be an active citizen and make a positive impact in your community.
              </p>
              <Link
                to="/videos"
                className="group inline-flex items-center space-x-3 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30"
              >
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Watch Now</span>
                <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Recent Updates</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Issue Resolved</p>
                  <p className="text-sm text-gray-600">Your complaint about street lighting has been fixed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">New Feature</p>
                  <p className="text-sm text-gray-600">AI translation tool is now available</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Community Update</p>
                  <p className="text-sm text-gray-600">New educational video about civic rights</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
