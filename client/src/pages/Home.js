import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LeafletMap from '../components/LeafletMap';
import IssueDetailsModal from '../components/IssueDetailsModal';
import { 
  MapPin, 
  Users, 
  Shield, 
  Lightbulb, 
  Globe, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Star,
  Heart
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState({});
  const [animatedStats, setAnimatedStats] = useState({
    issues: 0,
    resolution: 0,
    cities: 0,
    monitoring: 0
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const statsRef = useRef(null);

  // Sample issues in Bangalore region
  const sampleIssues = [
    {
      id: 1,
      title: 'Pothole on MG Road',
      description: 'Large pothole causing traffic congestion and vehicle damage',
      location: [12.9716, 77.5946],
      priority: 'high',
      category: 'Road Maintenance',
      status: 'open',
      reportedBy: 'Rajesh Kumar',
      reportedAt: '2024-01-15',
      isReal: false
    },
    {
      id: 2,
      title: 'Broken Street Light',
      description: 'Street light not working near Cubbon Park entrance',
      location: [12.9767, 77.5928],
      priority: 'medium',
      category: 'Street Lighting',
      status: 'in-progress',
      reportedBy: 'Priya Sharma',
      reportedAt: '2024-01-14',
      isReal: false
    },
    {
      id: 3,
      title: 'Garbage Collection Issue',
      description: 'Garbage not collected for 3 days in Koramangala',
      location: [12.9279, 77.6271],
      priority: 'urgent',
      category: 'Garbage Collection',
      status: 'open',
      reportedBy: 'Amit Patel',
      reportedAt: '2024-01-16',
      isReal: false
    },
    {
      id: 4,
      title: 'Water Supply Problem',
      description: 'No water supply in Whitefield area for 2 days',
      location: [12.9698, 77.7500],
      priority: 'high',
      category: 'Water Supply',
      status: 'open',
      reportedBy: 'Sunita Reddy',
      reportedAt: '2024-01-15',
      isReal: false
    },
    {
      id: 5,
      title: 'Traffic Signal Malfunction',
      description: 'Traffic signal not working at Silk Board junction',
      location: [12.9141, 77.6250],
      priority: 'urgent',
      category: 'Traffic Signals',
      status: 'resolved',
      reportedBy: 'Vikram Singh',
      reportedAt: '2024-01-13',
      isReal: false
    },
    {
      id: 6,
      title: 'Sewage Overflow',
      description: 'Sewage overflowing near Indiranagar metro station',
      location: [12.9716, 77.6412],
      priority: 'high',
      category: 'Sewage Issues',
      status: 'in-progress',
      reportedBy: 'Deepa Nair',
      reportedAt: '2024-01-14',
      isReal: false
    },
    {
      id: 7,
      title: 'Park Maintenance',
      description: 'Lalbagh Botanical Garden needs maintenance',
      location: [12.9507, 77.5848],
      priority: 'medium',
      category: 'Parks & Recreation',
      status: 'open',
      reportedBy: 'Kavitha Rao',
      reportedAt: '2024-01-12',
      isReal: false
    },
    {
      id: 8,
      title: 'Air Pollution',
      description: 'High air pollution levels near Electronic City',
      location: [12.8456, 77.6603],
      priority: 'medium',
      category: 'Air Pollution',
      status: 'open',
      reportedBy: 'Ravi Kumar',
      reportedAt: '2024-01-11',
      isReal: false
    },
    {
      id: 9,
      title: 'Broken Footpath',
      description: 'Damaged footpath near Brigade Road causing pedestrian safety issues',
      location: [12.9716, 77.6046],
      priority: 'medium',
      category: 'Road Maintenance',
      status: 'open',
      reportedBy: 'Anita Desai',
      reportedAt: '2024-01-10',
      isReal: false
    },
    {
      id: 10,
      title: 'Public Transport Delay',
      description: 'BMTC buses frequently delayed in Marathahalli area',
      location: [12.9581, 77.7010],
      priority: 'high',
      category: 'Public Transport',
      status: 'in-progress',
      reportedBy: 'Suresh Reddy',
      reportedAt: '2024-01-09',
      isReal: false
    },
    {
      id: 11,
      title: 'Noise Pollution',
      description: 'Excessive noise from construction near Ulsoor Lake',
      location: [12.9767, 77.6128],
      priority: 'medium',
      category: 'Noise Pollution',
      status: 'open',
      reportedBy: 'Meera Iyer',
      reportedAt: '2024-01-08',
      isReal: false
    },
    {
      id: 12,
      title: 'Drainage Blockage',
      description: 'Blocked drainage causing water logging in Malleswaram',
      location: [12.9910, 77.5710],
      priority: 'urgent',
      category: 'Sewage Issues',
      status: 'open',
      reportedBy: 'Krishna Murthy',
      reportedAt: '2024-01-07',
      isReal: false
    },
    {
      id: 13,
      title: 'Street Vendor Issue',
      description: 'Unauthorized street vendors blocking footpaths in Commercial Street',
      location: [12.9767, 77.6028],
      priority: 'medium',
      category: 'Other Issues',
      status: 'open',
      reportedBy: 'Rajesh Gupta',
      reportedAt: '2024-01-06',
      isReal: false
    },
    {
      id: 14,
      title: 'Power Outage',
      description: 'Frequent power cuts in Hebbal area affecting residents',
      location: [13.0359, 77.5970],
      priority: 'high',
      category: 'Other Issues',
      status: 'in-progress',
      reportedBy: 'Lakshmi Devi',
      reportedAt: '2024-01-05',
      isReal: false
    },
    {
      id: 15,
      title: 'Parking Problem',
      description: 'No designated parking causing traffic congestion in Church Street',
      location: [12.9767, 77.6046],
      priority: 'medium',
      category: 'Other Issues',
      status: 'open',
      reportedBy: 'Vikram Joshi',
      reportedAt: '2024-01-04',
      isReal: false
    }
  ];

  // Heat map data for Bangalore regions
  const heatMapData = [
    { lat: 12.9716, lng: 77.5946, intensity: 0.8, complaints: 15, priority: 'high' }, // MG Road
    { lat: 12.9767, lng: 77.5928, intensity: 0.6, complaints: 8, priority: 'medium' }, // Cubbon Park
    { lat: 12.9279, lng: 77.6271, intensity: 0.9, complaints: 22, priority: 'urgent' }, // Koramangala
    { lat: 12.9698, lng: 77.7500, intensity: 0.7, complaints: 12, priority: 'high' }, // Whitefield
    { lat: 12.9141, lng: 77.6250, intensity: 0.5, complaints: 6, priority: 'medium' }, // Silk Board
    { lat: 12.9716, lng: 77.6412, intensity: 0.8, complaints: 18, priority: 'high' }, // Indiranagar
    { lat: 12.9507, lng: 77.5848, intensity: 0.4, complaints: 4, priority: 'low' }, // Lalbagh
    { lat: 12.8456, lng: 77.6603, intensity: 0.6, complaints: 9, priority: 'medium' }, // Electronic City
    { lat: 12.8994, lng: 77.5847, intensity: 0.7, complaints: 14, priority: 'high' }, // Jayanagar
    { lat: 12.9308, lng: 77.5838, intensity: 0.5, complaints: 7, priority: 'medium' }, // JP Nagar
    { lat: 12.9719, lng: 77.6412, intensity: 0.6, complaints: 10, priority: 'medium' }, // HSR Layout
    { lat: 12.9141, lng: 77.6250, intensity: 0.8, complaints: 16, priority: 'high' } // Banashankari
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            if (entry.target.id === 'stats-section') {
              animateStats();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      if (section.id) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
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

    animateValue(0, 10000, (value) => 
      setAnimatedStats(prev => ({ ...prev, issues: value }))
    );
    animateValue(0, 85, (value) => 
      setAnimatedStats(prev => ({ ...prev, resolution: value }))
    );
    animateValue(0, 50, (value) => 
      setAnimatedStats(prev => ({ ...prev, cities: value }))
    );
  };

  // Handle issue click from map
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setShowIssueModal(true);
  };

  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Reporting',
      description: 'Report issues with precise location mapping using Google Maps integration.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      accentIcon: Zap
    },
    {
      icon: Users,
      title: 'AI-Powered Social Media',
      description: 'Automatic posting to Twitter and Instagram until issues are resolved.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      accentIcon: Star
    },
    {
      icon: Globe,
      title: 'Smart Translation',
      description: 'AI learns and translates content continuously as users interact.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      accentIcon: Sparkles
    },
    {
      icon: Lightbulb,
      title: 'Educational Content',
      description: 'Curated YouTube videos about civic responsibility and community awareness.',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      accentIcon: Heart
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboard with demographic insights and trend analysis.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      accentIcon: Star
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Advanced security measures to protect user data and ensure privacy.',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      accentIcon: CheckCircle
    },
    {
      icon: Globe,
      title: 'NLP Spam Detection',
      description: 'AI-powered natural language processing to detect spam and duplicate reports.',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      accentIcon: Zap
    },
    {
      icon: TrendingUp,
      title: 'Smart Filtering',
      description: 'Intelligent content analysis and automated report validation for quality assurance.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      accentIcon: Star
    }
  ];

  const categories = [
    'Potholes', 'Garbage Collection', 'Street Lighting', 'Water Supply',
    'Sewage Issues', 'Traffic Signals', 'Road Maintenance', 'Public Transport',
    'Parks & Recreation', 'Noise Pollution', 'Air Pollution', 'Other Issues'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-cyan-300/20 to-blue-400/20 rounded-full animate-bounce" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <section id="hero-section" className="relative z-10 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible['hero-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-yellow-300 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Smart Governance Platform
              </h1>
              <Shield className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-blue-200 mb-8 animate-pulse">
              AI-Powered Civic Intelligence 🏛️
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Comprehensive citizen database with detailed demographics for evidence-based governance. 
              Report issues, track progress, and empower communities with AI-driven insights.
            </p>
            
            {/* Key Features Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-yellow-300" />
                  <div>
                    <div className="text-white font-bold text-sm">Citizen Database</div>
                    <div className="text-blue-200 text-xs">Demographics & Analytics</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-yellow-300" />
                  <div>
                    <div className="text-white font-bold text-sm">Location Intelligence</div>
                    <div className="text-blue-200 text-xs">Precise Mapping & Tracking</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-yellow-300" />
                  <div>
                    <div className="text-white font-bold text-sm">AI Analytics</div>
                    <div className="text-blue-200 text-xs">Smart Insights & Trends</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-yellow-300" />
                  <div>
                    <div className="text-white font-bold text-sm">Social Media AI</div>
                    <div className="text-blue-200 text-xs">Automated Engagement</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/complaints/create"
                    className="group relative overflow-hidden bg-white/20 backdrop-blur-lg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 flex items-center justify-center space-x-3"
                  >
                    <span>Report an Issue</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/analytics"
                    className="group relative overflow-hidden bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500/30 hover:to-orange-500/30 hover:scale-105 transition-all duration-300 border border-yellow-400/30 flex items-center justify-center space-x-3"
                  >
                    <span>View Analytics</span>
                    <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative overflow-hidden bg-white/20 backdrop-blur-lg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 flex items-center justify-center space-x-3"
                  >
                    <span>Join Platform</span>
                    <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="group relative overflow-hidden border-2 border-white/50 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-lg flex items-center justify-center space-x-3"
                  >
                    <span>Government Login</span>
                    <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['features-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge AI technology with user-friendly design 
              to make civic engagement effortless and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:${feature.bgGradient}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10 text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <feature.accentIcon className="w-5 h-5 text-blue-500 animate-bounce" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['how-it-works-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                How It Works
              </h2>
              <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Simple steps to make a big difference in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  1
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Report Issue
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Take a photo, describe the problem, and pin the exact location on our interactive map.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  2
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Star className="w-6 h-6 text-yellow-500 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                AI Takes Action
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Our AI automatically posts to social media and categorizes your complaint for faster resolution.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  3
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="w-6 h-6 text-yellow-500 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                Track Progress
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Monitor the status of your complaint and get notified when it's resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['categories-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                What Can You Report?
              </h2>
              <MapPin className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From infrastructure issues to environmental concerns, we cover all aspects of civic life.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-white/30"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-gray-700 font-semibold group-hover:text-blue-600 transition-colors duration-300">
                  {category}
                </span>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircle className="w-4 h-4 text-blue-500 animate-bounce" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Issues Map Section */}
      <section id="map-section" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible['map-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-500 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Live Issues Map
              </h2>
              <MapPin className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interactive map showing civic issues across Bangalore. Toggle between issue markers and heat map visualization 
              to see complaint density and priority levels. Click on markers to view details.
            </p>
          </div>

          {/* Map Controls */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2">
              <button
                onClick={() => setShowHeatMap(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !showHeatMap 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Issues
              </button>
              <button
                onClick={() => setShowHeatMap(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  showHeatMap 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Heat Map
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <LeafletMap
              onIssueClick={handleIssueClick}
              selectedIssue={selectedIssue}
              className="h-96"
              isInteractive={false}
              sampleIssues={sampleIssues}
              heatMapData={heatMapData}
              showHeatMap={showHeatMap}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Toggle between Issues and Heat Map views. Issue markers show individual complaints with priority colors, 
              while heat map circles display complaint density across different areas of Bangalore.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Urgent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" ref={statsRef} className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                {animatedStats.issues.toLocaleString()}+
              </div>
              <div className="text-blue-200 text-lg font-semibold group-hover:text-white transition-colors duration-300">
                Issues Reported
              </div>
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <TrendingUp className="w-6 h-6 text-yellow-300 animate-bounce" />
              </div>
            </div>
            
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
                {animatedStats.resolution}%
              </div>
              <div className="text-blue-200 text-lg font-semibold group-hover:text-white transition-colors duration-300">
                Resolution Rate
              </div>
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle className="w-6 h-6 text-green-300 animate-bounce" />
              </div>
            </div>
            
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
                {animatedStats.cities}+
              </div>
              <div className="text-blue-200 text-lg font-semibold group-hover:text-white transition-colors duration-300">
                Cities Covered
              </div>
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MapPin className="w-6 h-6 text-purple-300 animate-bounce" />
              </div>
            </div>
            
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-blue-200 text-lg font-semibold group-hover:text-white transition-colors duration-300">
                AI Monitoring
              </div>
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Zap className="w-6 h-6 text-orange-300 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI/NLP Intelligence Section */}
      <section id="ai-nlp-section" className="py-24 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['ai-nlp-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Content Intelligence
              </h2>
              <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Advanced NLP models for spam detection, duplicate prevention, and content quality assurance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-red-50 to-pink-50">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">
                  Spam Detection
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  AI-powered natural language processing to identify and filter spam reports, ensuring only legitimate complaints reach government officials.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">NLP Analysis</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Spam Filter</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Auto-Block</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-orange-50 to-red-50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-700 transition-colors duration-300">
                  Duplicate Detection
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Intelligent content similarity analysis to prevent duplicate reports and consolidate related complaints for efficient processing.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Similarity Check</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Auto-Merge</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Consolidation</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-50 to-pink-50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                  Content Quality
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Automated content validation and quality scoring to ensure reports meet standards and provide actionable information for resolution.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Quality Score</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Validation</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Standards</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Model Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
                  <div className="text-gray-600">Spam Detection Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">90%</div>
                  <div className="text-gray-600">Duplicate Prevention</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">85%</div>
                  <div className="text-gray-600">Content Quality Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">Real-time</div>
                  <div className="text-gray-600">Processing Speed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Benefits Section */}
      <section id="government-section" className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['government-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-blue-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Government Intelligence Platform
              </h2>
              <Shield className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive citizen database with detailed demographics for evidence-based governance and policy making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-blue-50 to-cyan-50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  Citizen Demographics
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Comprehensive database with age, gender, religion, caste, occupation, and location data for targeted policy implementation.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Age Groups</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Gender</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Religion</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Caste</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-green-50 to-emerald-50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                  Policy Analytics
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Real-time insights into citizen needs, complaint patterns, and demographic trends for data-driven governance decisions.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Trends</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Patterns</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Insights</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Reports</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-50 to-pink-50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                  Geographic Intelligence
                </h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Location-based data analysis for infrastructure planning, resource allocation, and regional development strategies.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Locations</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Hotspots</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Coverage</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Planning</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Government Dashboard Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Citizen Records</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                  <div className="text-gray-600">Data Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">Real-time Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Data Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="tech-section" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['tech-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Built with Modern Technology
              </h2>
              <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leveraging cutting-edge technologies to deliver a seamless user experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'React', color: 'from-blue-500 to-cyan-500', icon: '⚛️' },
              { name: 'Node.js', color: 'from-green-500 to-emerald-500', icon: '🟢' },
              { name: 'MongoDB', color: 'from-emerald-500 to-teal-500', icon: '🍃' },
              { name: 'AI/ML', color: 'from-purple-500 to-pink-500', icon: '🤖' },
              { name: 'Maps', color: 'from-red-500 to-orange-500', icon: '🗺️' },
              { name: 'Analytics', color: 'from-indigo-500 to-purple-500', icon: '📊' }
            ].map((tech, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-white/30"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {tech.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials-section" className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['testimonials-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-6">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Success Stories
              </h2>
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hear from citizens who have made a real difference in their communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Community Activist</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "This platform helped us get our street lighting fixed in just 3 days! The AI-powered social media posts really got the attention of local authorities."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Michael Chen</h4>
                    <p className="text-sm text-gray-600">Local Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "The real-time analytics helped us understand community needs better. We've seen a 40% improvement in issue resolution rates."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Aisha Patel</h4>
                    <p className="text-sm text-gray-600">City Council Member</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "The educational videos have been a game-changer for civic awareness. Citizens are now more engaged and informed about their responsibilities."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible['cta-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-8">
              <Shield className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Transform Governance with Data
              </h2>
              <Shield className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the smart governance revolution! Our platform provides comprehensive citizen insights, 
              AI-powered analytics, and evidence-based tools for government officials and engaged citizens.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl"
                >
                  <span>Join as Citizen</span>
                  <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-yellow-700 hover:to-orange-700 hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl"
                >
                  <span>Government Access</span>
                  <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Issue Details Modal */}
      {showIssueModal && selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedIssue(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;
