import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import config from '../config';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  Clock,
  User,
  MoreHorizontal,
  Send,
  Flag,
  Star,
  TrendingUp,
  Users,
  Filter,
  Search
} from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeTab, setActiveTab] = useState('community');
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Hardcoded community data with more posts and images
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        user: {
          name: 'Sarah Johnson',
          avatar: 'SJ',
          role: 'citizen',
          verified: true
        },
        title: 'Broken Street Light on Main Street',
        description: 'There\'s a street light that has been broken for over a week now. It\'s making the area unsafe for pedestrians, especially at night. The light is located near the intersection of Main Street and Oak Avenue.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
        category: 'street-lighting',
        priority: 'high',
        location: {
          address: 'Main Street & Oak Avenue',
          city: 'Downtown',
          coordinates: { lat: 28.6139, lng: 77.2090 }
        },
        status: 'open',
        votes: {
          up: 24,
          down: 3,
          verified: 8
        },
        comments: [
          {
            id: 1,
            user: { name: 'Mike Chen', avatar: 'MC' },
            text: 'I pass by this area daily and can confirm the light has been out for at least 10 days.',
            timestamp: '2 hours ago',
            verified: true
          },
          {
            id: 2,
            user: { name: 'Lisa Park', avatar: 'LP' },
            text: 'Same issue reported to the city council last week. They said it would be fixed within 48 hours.',
            timestamp: '1 hour ago',
            verified: false
          }
        ],
        createdAt: '2024-01-15T10:30:00Z',
        tags: ['street-lighting', 'safety', 'downtown']
      },
      {
        id: 2,
        user: {
          name: 'Raj Patel',
          avatar: 'RP',
          role: 'citizen',
          verified: false
        },
        title: 'Garbage Collection Issue in Residential Area',
        description: 'Garbage hasn\'t been collected in our neighborhood for the past 3 days. The bins are overflowing and creating a health hazard. This is affecting the entire block.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'garbage',
        priority: 'medium',
        location: {
          address: 'Residential Block 5A',
          city: 'Suburbs',
          coordinates: { lat: 28.6140, lng: 77.2091 }
        },
        status: 'in-progress',
        votes: {
          up: 18,
          down: 1,
          verified: 5
        },
        comments: [
          {
            id: 3,
            user: { name: 'Amit Kumar', avatar: 'AK' },
            text: 'I live in the same area and can confirm this issue. The smell is getting worse.',
            timestamp: '3 hours ago',
            verified: true
          }
        ],
        createdAt: '2024-01-14T14:20:00Z',
        tags: ['garbage', 'health', 'residential']
      },
      {
        id: 3,
        user: {
          name: 'Emily Davis',
          avatar: 'ED',
          role: 'citizen',
          verified: true
        },
        title: 'Large Pothole on Highway 101',
        description: 'There\'s a massive pothole on Highway 101 that\'s causing traffic delays and potential vehicle damage. It\'s about 2 feet wide and 6 inches deep. Multiple cars have already been damaged.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'potholes',
        priority: 'urgent',
        location: {
          address: 'Highway 101, Mile Marker 15',
          city: 'Highway',
          coordinates: { lat: 28.6141, lng: 77.2092 }
        },
        status: 'resolved',
        votes: {
          up: 45,
          down: 2,
          verified: 12
        },
        comments: [
          {
            id: 4,
            user: { name: 'John Smith', avatar: 'JS' },
            text: 'Great news! I drove by today and the pothole has been filled. Thanks for reporting this!',
            timestamp: '5 hours ago',
            verified: true
          }
        ],
        createdAt: '2024-01-13T09:15:00Z',
        tags: ['potholes', 'highway', 'traffic', 'resolved']
      },
      {
        id: 4,
        user: {
          name: 'Maria Rodriguez',
          avatar: 'MR',
          role: 'citizen',
          verified: false
        },
        title: 'Water Leak in Public Park',
        description: 'There\'s a significant water leak in Central Park near the fountain. Water is pooling around the area and the grass is getting waterlogged. This could lead to flooding if not addressed soon.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'water-supply',
        priority: 'high',
        location: {
          address: 'Central Park, Near Fountain',
          city: 'Downtown',
          coordinates: { lat: 28.6142, lng: 77.2093 }
        },
        status: 'open',
        votes: {
          up: 12,
          down: 0,
          verified: 3
        },
        comments: [],
        createdAt: '2024-01-16T16:45:00Z',
        tags: ['water-leak', 'park', 'flooding']
      },
      {
        id: 5,
        user: {
          name: 'David Kim',
          avatar: 'DK',
          role: 'citizen',
          verified: true
        },
        title: 'Damaged Sidewalk in School Zone',
        description: 'The sidewalk outside Lincoln Elementary School has several cracked and uneven sections. This poses a safety risk for children walking to school. The damage seems to be getting worse.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'road-maintenance',
        priority: 'high',
        location: {
          address: 'Lincoln Elementary School',
          city: 'School District',
          coordinates: { lat: 28.6143, lng: 77.2094 }
        },
        status: 'in-progress',
        votes: {
          up: 31,
          down: 1,
          verified: 7
        },
        comments: [
          {
            id: 5,
            user: { name: 'Parent Concerned', avatar: 'PC' },
            text: 'As a parent, I\'m really concerned about this. My child walks this route daily.',
            timestamp: '4 hours ago',
            verified: false
          }
        ],
        createdAt: '2024-01-15T08:30:00Z',
        tags: ['sidewalk', 'school', 'safety', 'children']
      },
      {
        id: 6,
        user: {
          name: 'Alex Thompson',
          avatar: 'AT',
          role: 'citizen',
          verified: true
        },
        title: 'Traffic Signal Malfunction at Busy Intersection',
        description: 'The traffic light at the intersection of 5th Avenue and Broadway has been malfunctioning for 3 days. It\'s stuck on red in all directions, causing massive traffic jams during rush hour.',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop',
        category: 'traffic-signals',
        priority: 'urgent',
        location: {
          address: '5th Avenue & Broadway',
          city: 'Downtown',
          coordinates: { lat: 28.6144, lng: 77.2095 }
        },
        status: 'open',
        votes: {
          up: 67,
          down: 2,
          verified: 15
        },
        comments: [
          {
            id: 6,
            user: { name: 'Traffic Controller', avatar: 'TC' },
            text: 'This is causing major delays. I\'ve contacted the traffic department.',
            timestamp: '1 hour ago',
            verified: true
          }
        ],
        createdAt: '2024-01-16T07:20:00Z',
        tags: ['traffic', 'signal', 'intersection', 'rush-hour']
      },
      {
        id: 7,
        user: {
          name: 'Jennifer Lee',
          avatar: 'JL',
          role: 'citizen',
          verified: false
        },
        title: 'Sewage Overflow in Residential Street',
        description: 'There\'s a sewage overflow on Elm Street that\'s been going on for 2 days. The smell is unbearable and it\'s creating a health hazard for residents. Water is backing up into the street.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'sewage',
        priority: 'urgent',
        location: {
          address: 'Elm Street, Block 3B',
          city: 'Residential',
          coordinates: { lat: 28.6145, lng: 77.2096 }
        },
        status: 'in-progress',
        votes: {
          up: 89,
          down: 1,
          verified: 22
        },
        comments: [
          {
            id: 7,
            user: { name: 'Health Inspector', avatar: 'HI' },
            text: 'This is a serious health hazard. I\'ve escalated this to the emergency services.',
            timestamp: '30 minutes ago',
            verified: true
          }
        ],
        createdAt: '2024-01-15T18:45:00Z',
        tags: ['sewage', 'health', 'overflow', 'residential']
      },
      {
        id: 8,
        user: {
          name: 'Michael Brown',
          avatar: 'MB',
          role: 'citizen',
          verified: true
        },
        title: 'Damaged Fire Hydrant in Neighborhood',
        description: 'The fire hydrant on Oak Street has been damaged, possibly by a vehicle. Water is leaking and the hydrant is not functional. This could be dangerous in case of a fire emergency.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'other',
        priority: 'high',
        location: {
          address: 'Oak Street, Near Park',
          city: 'Neighborhood',
          coordinates: { lat: 28.6146, lng: 77.2097 }
        },
        status: 'open',
        votes: {
          up: 34,
          down: 0,
          verified: 9
        },
        comments: [
          {
            id: 8,
            user: { name: 'Fire Chief', avatar: 'FC' },
            text: 'This is a critical safety issue. I\'ve notified the fire department immediately.',
            timestamp: '2 hours ago',
            verified: true
          }
        ],
        createdAt: '2024-01-16T12:15:00Z',
        tags: ['fire-hydrant', 'safety', 'emergency', 'damaged']
      },
      {
        id: 9,
        user: {
          name: 'Lisa Wang',
          avatar: 'LW',
          role: 'citizen',
          verified: true
        },
        title: 'Broken Bench in City Park',
        description: 'One of the benches in Riverside Park is completely broken and unsafe to sit on. The wood is splintered and the metal frame is bent. This is a popular spot for families.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'parks-recreation',
        priority: 'medium',
        location: {
          address: 'Riverside Park, Bench Area',
          city: 'Park District',
          coordinates: { lat: 28.6147, lng: 77.2098 }
        },
        status: 'resolved',
        votes: {
          up: 23,
          down: 1,
          verified: 6
        },
        comments: [
          {
            id: 9,
            user: { name: 'Park Ranger', avatar: 'PR' },
            text: 'Bench has been replaced! Thanks for the report.',
            timestamp: '6 hours ago',
            verified: true
          }
        ],
        createdAt: '2024-01-14T15:30:00Z',
        tags: ['bench', 'park', 'maintenance', 'family']
      },
      {
        id: 10,
        user: {
          name: 'Robert Garcia',
          avatar: 'RG',
          role: 'citizen',
          verified: false
        },
        title: 'Noise Pollution from Construction Site',
        description: 'There\'s excessive noise from a construction site near my apartment building. They\'re working late into the night and early morning, violating noise ordinances. This is affecting sleep for many residents.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'noise-pollution',
        priority: 'medium',
        location: {
          address: 'Construction Site, 3rd Street',
          city: 'Residential',
          coordinates: { lat: 28.6148, lng: 77.2099 }
        },
        status: 'open',
        votes: {
          up: 41,
          down: 3,
          verified: 11
        },
        comments: [
          {
            id: 10,
            user: { name: 'Neighbor', avatar: 'N' },
            text: 'I can confirm this. The noise is unbearable at night.',
            timestamp: '4 hours ago',
            verified: false
          }
        ],
        createdAt: '2024-01-16T09:00:00Z',
        tags: ['noise', 'construction', 'residential', 'sleep']
      },
      {
        id: 11,
        user: {
          name: 'Amanda Taylor',
          avatar: 'AT',
          role: 'citizen',
          verified: true
        },
        title: 'Graffiti on Public Building',
        description: 'There\'s extensive graffiti on the side of the public library building. While some might consider it art, it\'s covering official signage and making the building look unprofessional.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'other',
        priority: 'low',
        location: {
          address: 'Public Library, Main Branch',
          city: 'Downtown',
          coordinates: { lat: 28.6149, lng: 77.2100 }
        },
        status: 'in-progress',
        votes: {
          up: 15,
          down: 8,
          verified: 4
        },
        comments: [
          {
            id: 11,
            user: { name: 'Librarian', avatar: 'L' },
            text: 'We\'re working with the city to have this cleaned up professionally.',
            timestamp: '3 hours ago',
            verified: true
          }
        ],
        createdAt: '2024-01-15T14:20:00Z',
        tags: ['graffiti', 'library', 'vandalism', 'cleanup']
      },
      {
        id: 12,
        user: {
          name: 'Kevin Chen',
          avatar: 'KC',
          role: 'citizen',
          verified: true
        },
        title: 'Fallen Tree Blocking Road',
        description: 'A large tree has fallen across Maple Street after last night\'s storm. It\'s completely blocking traffic and could be dangerous. Emergency services need to clear this immediately.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
        category: 'other',
        priority: 'urgent',
        location: {
          address: 'Maple Street, Near School',
          city: 'Residential',
          coordinates: { lat: 28.6150, lng: 77.2101 }
        },
        status: 'resolved',
        votes: {
          up: 56,
          down: 0,
          verified: 18
        },
        comments: [
          {
            id: 12,
            user: { name: 'Emergency Crew', avatar: 'EC' },
            text: 'Tree has been cleared and road is now open. Thanks for the quick report!',
            timestamp: '1 hour ago',
            verified: true
          }
        ],
        createdAt: '2024-01-16T06:30:00Z',
        tags: ['tree', 'storm', 'blocking', 'emergency']
      }
    ];

    // Fetch real complaints from API and combine with hardcoded data
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_URL}/api/complaints/public`, {
          params: {
            limit: 50,
            category: selectedFilter !== 'all' ? selectedFilter : undefined
          }
        });
        
        // Transform API data to match the expected format
        const transformedPosts = response.data.complaints.map(complaint => ({
          id: complaint._id,
          user: {
            name: complaint.user?.name || 'Anonymous',
            avatar: complaint.user?.name?.charAt(0) || 'A',
            role: 'citizen',
            verified: true
          },
          title: complaint.title,
          description: complaint.description,
          image: complaint.images && complaint.images.length > 0 
            ? `${config.API_URL}${complaint.images[0].url}` 
            : null,
          category: complaint.category,
          priority: complaint.priority,
          location: {
            address: complaint.location?.address || 'Location not specified',
            city: complaint.location?.city || 'Unknown',
            coordinates: complaint.location?.coordinates || { lat: 0, lng: 0 }
          },
          status: complaint.status || 'open',
          votes: {
            up: Math.floor(Math.random() * 50) + 5, // Mock votes for now
            down: Math.floor(Math.random() * 10),
            verified: Math.floor(Math.random() * 20) + 2
          },
          comments: [], // Comments will be empty for now
          createdAt: complaint.createdAt,
          tags: [complaint.category, complaint.priority, complaint.status],
          isRealReport: true // Mark as real user report
        }));

        // Combine hardcoded data with real API data
        console.log('Mock posts:', mockPosts.length);
        console.log('Real posts:', transformedPosts.length);
        console.log('Total posts:', mockPosts.length + transformedPosts.length);
        setPosts([...mockPosts, ...transformedPosts]);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        // If API fails, just use hardcoded data
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [selectedFilter, lastRefresh]);

  // Add refresh function
  const refreshData = () => {
    setLastRefresh(Date.now());
  };

  const handleVote = (postId, voteType) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? {
              ...post,
              votes: {
                ...post.votes,
                [voteType]: post.votes[voteType] + 1
              }
            }
          : post
      )
    );
  };

  const handleComment = (postId) => {
    if (!newComment[postId]?.trim()) return;

    const comment = {
      id: Date.now(),
      user: { name: user?.name || 'Anonymous', avatar: user?.name?.charAt(0) || 'A' },
      text: newComment[postId],
      timestamp: 'Just now',
      verified: false
    };

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: [...post.comments, comment]
            }
          : post
      )
    );

    setNewComment(prev => ({ ...prev, [postId]: '' }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === 'all' || post.category === selectedFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isUserPost = post.user.name === user?.name;
    const matchesTab = activeTab === 'community' ? !isUserPost : isUserPost;
    return matchesFilter && matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600">Share, discuss, and solve local issues together</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Issues</option>
                  <option value="potholes">Potholes</option>
                  <option value="garbage">Garbage Collection</option>
                  <option value="street-lighting">Street Lighting</option>
                  <option value="water-supply">Water Supply</option>
                  <option value="sewage">Sewage Issues</option>
                  <option value="traffic-signals">Traffic Signals</option>
                  <option value="road-maintenance">Road Maintenance</option>
                  <option value="public-transport">Public Transport</option>
                  <option value="parks-recreation">Parks & Recreation</option>
                  <option value="noise-pollution">Noise Pollution</option>
                  <option value="air-pollution">Air Pollution</option>
                  <option value="other">Other Issues</option>
                </select>
              </div>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Refresh to see latest reports"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'community'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Community Feed
            </button>
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my-reports'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{post.user.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                          {post.user.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                          {post.isRealReport && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Live Report
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <MapPin className="w-3 h-3 ml-2" />
                          <span>{post.location.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(post.priority)}`}>
                        {post.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status.replace('-', ' ')}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>
                  
                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => handleVote(post.id, 'up')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.votes.up}</span>
                      </button>
                      <button 
                        onClick={() => handleVote(post.id, 'down')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.votes.down}</span>
                      </button>
                      <button 
                        onClick={() => handleVote(post.id, 'verified')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.votes.verified} verified</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="border-t border-gray-100">
                    <div className="p-6">
                      <div className="space-y-4 mb-4">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">{comment.user.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 text-sm">{comment.user.name}</span>
                                {comment.verified && (
                                  <CheckCircle className="w-3 h-3 text-blue-500" />
                                )}
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Comment */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Active Members</span>
                  </div>
                  <span className="font-semibold text-gray-900">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Issues Reported</span>
                  </div>
                  <span className="font-semibold text-gray-900">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Issues Resolved</span>
                  </div>
                  <span className="font-semibold text-gray-900">1,089</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <span className="font-semibold text-gray-900">91%</span>
                </div>
              </div>
            </div>

            {/* Trending Issues */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Issues</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Traffic Issues</p>
                    <p className="text-xs text-gray-500">28 new reports</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sewage Problems</p>
                    <p className="text-xs text-gray-500">22 new reports</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Street Lighting</p>
                    <p className="text-xs text-gray-500">18 new reports</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Emergency Issues</p>
                    <p className="text-xs text-gray-500">12 new reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Report New Issue</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">View Map</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Rate Solutions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
