import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const statsRef = useRef(null);

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
      description: 'Daily AI-generated videos about civic responsibility and community awareness.',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      accentIcon: Heart
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
              <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Build Better Communities
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" style={{animationDirection: 'reverse'}} />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-blue-200 mb-8 animate-pulse">
              Together ✨
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Report civic issues, learn about community responsibility, and make your voice heard 
              with our AI-powered citizen complaint portal. Join the movement for positive change!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/complaints/create"
                  className="group relative overflow-hidden bg-white/20 backdrop-blur-lg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 flex items-center justify-center space-x-3"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative overflow-hidden bg-white/20 backdrop-blur-lg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 flex items-center justify-center space-x-3"
                  >
                    <span>Get Started</span>
                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="group relative overflow-hidden border-2 border-white/50 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-lg flex items-center justify-center space-x-3"
                  >
                    <span>Login</span>
                    <Star className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
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

      {/* CTA Section */}
      <section id="cta-section" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible['cta-section'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 mb-8">
              <Heart className="w-8 h-8 text-red-400 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Ready to Make a Difference?
              </h2>
              <Heart className="w-8 h-8 text-red-400 animate-pulse" />
            </div>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of citizens who are already using our platform to build better communities.
              Your voice matters, and together we can create positive change!
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
