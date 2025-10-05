import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Clock,
  BarChart3,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  FileText,
  Calendar,
  Phone,
  Mail,
  Shield,
  Settings,
  Database,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  X,
  Activity,
  PieChart
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import Analytics from '../components/Analytics';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);
  const [citizenStats, setCitizenStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [citizensLoading, setCitizensLoading] = useState(false);
  
  // Filters
  const [complaintFilters, setComplaintFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [userFilters, setUserFilters] = useState({
    role: '',
    status: '',
    search: ''
  });
  const [citizenFilters, setCitizenFilters] = useState({
    gender: '',
    caste: '',
    religion: '',
    occupation: '',
    verificationStatus: '',
    isActive: '',
    search: '',
    ageMin: '',
    ageMax: '',
    incomeMin: '',
    incomeMax: '',
    residenceType: '',
    language: '',
    hasIncome: '',
    registrationDateFrom: '',
    registrationDateTo: '',
    location: ''
  });
  
  // Sorting and pagination
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showCitizenModal, setShowCitizenModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    console.log('Admin Dashboard - Current user:', user);
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
      setPriorityStats(response.data.priorityStats || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const params = new URLSearchParams();
      if (complaintFilters.status) params.append('status', complaintFilters.status);
      if (complaintFilters.category) params.append('category', complaintFilters.category);
      if (complaintFilters.priority) params.append('priority', complaintFilters.priority);
      if (complaintFilters.search) params.append('search', complaintFilters.search);
      
      const response = await axios.get(`/api/admin/complaints?${params.toString()}`);
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setComplaintsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      if (userFilters.role) params.append('role', userFilters.role);
      if (userFilters.status) params.append('status', userFilters.status);
      if (userFilters.search) params.append('search', userFilters.search);
      
      const response = await axios.get(`/api/admin/users?${params.toString()}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchCitizens = async () => {
    try {
      setCitizensLoading(true);
      const params = new URLSearchParams();
      
      // Add basic filters
      if (citizenFilters.gender) params.append('gender', citizenFilters.gender);
      if (citizenFilters.caste) params.append('caste', citizenFilters.caste);
      if (citizenFilters.religion) params.append('religion', citizenFilters.religion);
      if (citizenFilters.occupation) params.append('occupation', citizenFilters.occupation);
      if (citizenFilters.verificationStatus) params.append('verificationStatus', citizenFilters.verificationStatus);
      if (citizenFilters.isActive) params.append('isActive', citizenFilters.isActive);
      if (citizenFilters.search) params.append('search', citizenFilters.search);
      
      // Add new advanced filters
      if (citizenFilters.ageMin) params.append('ageMin', citizenFilters.ageMin);
      if (citizenFilters.ageMax) params.append('ageMax', citizenFilters.ageMax);
      if (citizenFilters.incomeMin) params.append('incomeMin', citizenFilters.incomeMin);
      if (citizenFilters.incomeMax) params.append('incomeMax', citizenFilters.incomeMax);
      if (citizenFilters.residenceType) params.append('residenceType', citizenFilters.residenceType);
      if (citizenFilters.language) params.append('language', citizenFilters.language);
      if (citizenFilters.hasIncome) params.append('hasIncome', citizenFilters.hasIncome);
      if (citizenFilters.registrationDateFrom) params.append('registrationDateFrom', citizenFilters.registrationDateFrom);
      if (citizenFilters.registrationDateTo) params.append('registrationDateTo', citizenFilters.registrationDateTo);
      if (citizenFilters.location) params.append('location', citizenFilters.location);
      
      // Add sorting
      params.append('sortBy', sortField);
      params.append('sortOrder', sortOrder);
      params.append('page', currentPage);
      params.append('limit', '10');
      
      const response = await axios.get(`/api/admin/citizens?${params.toString()}`);
      setCitizens(response.data.citizens);
    } catch (error) {
      console.error('Error fetching citizens:', error);
    } finally {
      setCitizensLoading(false);
    }
  };

  const fetchCitizenStats = async () => {
    try {
      const response = await axios.get('/api/admin/citizen-stats');
      setCitizenStats(response.data);
    } catch (error) {
      console.error('Error fetching citizen stats:', error);
    }
  };

  const updateCitizenVerification = async (citizenId, verificationStatus) => {
    try {
      await axios.put(`/api/admin/citizens/${citizenId}/verification`, {
        verificationStatus
      });
      
      // Refresh citizens list
      fetchCitizens();
      fetchCitizenStats();
    } catch (error) {
      console.error('Error updating citizen verification:', error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = async (type) => {
    try {
      const response = await axios.get(`/api/admin/${type}/export/csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'complaints') {
      fetchComplaints();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'citizens') {
      fetchCitizens();
      fetchCitizenStats();
    }
  }, [activeTab, complaintFilters, userFilters, citizenFilters, sortField, sortOrder, currentPage]);

  const updateComplaintStatus = async (complaintId, status, message) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}/status`, {
        status,
        message
      });
      fetchComplaints(); // Refresh the list
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { isActive });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentComplaints = dashboardData?.recentComplaints || [];
  const categoryStats = dashboardData?.categoryStats || [];

  // Helper functions for citizen data
  const getCasteLabel = (caste) => {
    const casteLabels = {
      'general': 'General',
      'obc': 'OBC',
      'sc': 'SC',
      'st': 'ST',
      'other': 'Other',
      '': 'Not specified'
    };
    return casteLabels[caste] || 'Not specified';
  };

  const getReligionLabel = (religion) => {
    const religionLabels = {
      'hinduism': 'Hinduism',
      'islam': 'Islam',
      'christianity': 'Christianity',
      'sikhism': 'Sikhism',
      'buddhism': 'Buddhism',
      'jainism': 'Jainism',
      'other': 'Other',
      '': 'Not specified'
    };
    return religionLabels[religion] || 'Not specified';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        label: 'Pending',
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      'approved': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Approved',
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      'rejected': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        label: 'Rejected',
        icon: <X className="w-3 h-3 mr-1" />
      }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-blue-100 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Manage complaints and users in the citizen complaint system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2 border border-white border-opacity-30">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-sm text-blue-100">Signed in as</span>
                <span className="text-sm font-semibold text-white">{user?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
              {activeTab === 'overview' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'complaints'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Complaints</span>
              {activeTab === 'complaints' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
              {activeTab === 'users' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('citizens')}
              className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'citizens'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Citizens</span>
              {activeTab === 'citizens' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Analytics</span>
              {activeTab === 'analytics' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.complaints?.total || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.complaints?.open || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.complaints?.resolved || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Urgent Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.complaints?.urgent || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.users?.total || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Complaints */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
                </div>
                <div className="p-6">
                  {recentComplaints.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No complaints yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                complaint.priority === 'low' ? 'bg-green-100 text-green-800' :
                                complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {complaint.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{complaint.user?.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              complaint.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                              complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.status.replace('-', ' ')}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Category Distribution</h2>
                </div>
                <div className="p-6">
                  {categoryStats.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No data available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categoryStats.slice(0, 5).map((category) => (
                        <div key={category._id} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {category._id.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${(category.count / Math.max(...categoryStats.map(c => c.count))) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {category.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Priority Distribution</h2>
                </div>
                <div className="p-6">
                  {priorityStats.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No data available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {priorityStats.map((priority) => (
                        <div key={priority._id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${
                              priority._id === 'low' ? 'bg-green-500' :
                              priority._id === 'medium' ? 'bg-yellow-500' :
                              priority._id === 'high' ? 'bg-orange-500' :
                              priority._id === 'urgent' ? 'bg-red-500' : 'bg-gray-500'
                            }`}></span>
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {priority._id}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  priority._id === 'low' ? 'bg-green-500' :
                                  priority._id === 'medium' ? 'bg-yellow-500' :
                                  priority._id === 'high' ? 'bg-orange-500' :
                                  priority._id === 'urgent' ? 'bg-red-500' : 'bg-gray-500'
                                }`}
                                style={{ 
                                  width: `${(priority.count / Math.max(...priorityStats.map(p => p.count))) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {priority.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={complaintFilters.status}
                    onChange={(e) => setComplaintFilters({...complaintFilters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={complaintFilters.priority}
                    onChange={(e) => setComplaintFilters({...complaintFilters, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={complaintFilters.category}
                    onChange={(e) => setComplaintFilters({...complaintFilters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="potholes">Potholes</option>
                    <option value="garbage">Garbage</option>
                    <option value="street-lighting">Street Lighting</option>
                    <option value="water-supply">Water Supply</option>
                    <option value="sewage">Sewage</option>
                    <option value="traffic-signals">Traffic Signals</option>
                    <option value="road-maintenance">Road Maintenance</option>
                    <option value="public-transport">Public Transport</option>
                    <option value="parks-recreation">Parks & Recreation</option>
                    <option value="noise-pollution">Noise Pollution</option>
                    <option value="air-pollution">Air Pollution</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search complaints..."
                      value={complaintFilters.search}
                      onChange={(e) => setComplaintFilters({...complaintFilters, search: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchComplaints}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Complaints</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                {complaintsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="small" />
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No complaints found</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {complaints.map((complaint) => (
                        <tr key={complaint._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{complaint.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{complaint.user?.name}</div>
                            <div className="text-sm text-gray-500">{complaint.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">{complaint.category.replace('-', ' ')}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              complaint.priority === 'low' ? 'bg-green-100 text-green-800' :
                              complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              complaint.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                              complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateComplaintStatus(complaint._id, 'in-progress', 'Status updated to in-progress')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Start
                              </button>
                              <button
                                onClick={() => updateComplaintStatus(complaint._id, 'resolved', 'Complaint resolved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Resolve
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={userFilters.role}
                    onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Roles</option>
                    <option value="citizen">Citizen</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={userFilters.status}
                    onChange={(e) => setUserFilters({...userFilters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userFilters.search}
                      onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchUsers}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="small" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users found</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone}</div>
                            <div className="text-sm text-gray-500">{user.location?.city}, {user.location?.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateUserStatus(user._id, !user.isActive)}
                                className={`${
                                  user.isActive 
                                    ? 'text-red-600 hover:text-red-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="w-4 h-4 inline mr-1" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 inline mr-1" />
                                    Activate
                                  </>
                                )}
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Citizen Database Tab */}
        {activeTab === 'citizens' && (
          <div className="space-y-6">
            {/* Citizen Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Citizens</p>
                    <p className="text-2xl font-bold text-gray-900">{citizenStats.total || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-gray-900">{citizenStats.verified || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                    <p className="text-2xl font-bold text-gray-900">{citizenStats.pending || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{citizenStats.active || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Advanced Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                  {citizensLoading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <LoadingSpinner size="small" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => exportToCSV('citizens')}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search citizens..."
                    value={citizenFilters.search}
                    onChange={(e) => setCitizenFilters({...citizenFilters, search: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <select
                    value={citizenFilters.verificationStatus}
                    onChange={(e) => setCitizenFilters({...citizenFilters, verificationStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">All Verification Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <select
                    value={citizenFilters.isActive}
                    onChange={(e) => setCitizenFilters({...citizenFilters, isActive: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchCitizens}
                    disabled={citizensLoading}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${citizensLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="space-y-6 pt-4 border-t border-gray-200">
                  {/* Basic Demographics */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Demographics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          value={citizenFilters.gender}
                          onChange={(e) => setCitizenFilters({...citizenFilters, gender: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                        <select
                          value={citizenFilters.caste}
                          onChange={(e) => setCitizenFilters({...citizenFilters, caste: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Castes</option>
                          <option value="general">General</option>
                          <option value="obc">OBC</option>
                          <option value="sc">SC</option>
                          <option value="st">ST</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                        <select
                          value={citizenFilters.religion}
                          onChange={(e) => setCitizenFilters({...citizenFilters, religion: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Religions</option>
                          <option value="hinduism">Hinduism</option>
                          <option value="islam">Islam</option>
                          <option value="christianity">Christianity</option>
                          <option value="sikhism">Sikhism</option>
                          <option value="buddhism">Buddhism</option>
                          <option value="jainism">Jainism</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={citizenFilters.ageMin}
                            onChange={(e) => setCitizenFilters({...citizenFilters, ageMin: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={citizenFilters.ageMax}
                            onChange={(e) => setCitizenFilters({...citizenFilters, ageMax: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Professional Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                        <input
                          type="text"
                          placeholder="Search occupation..."
                          value={citizenFilters.occupation}
                          onChange={(e) => setCitizenFilters({...citizenFilters, occupation: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Income Range (₹)</label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={citizenFilters.incomeMin}
                            onChange={(e) => setCitizenFilters({...citizenFilters, incomeMin: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={citizenFilters.incomeMax}
                            onChange={(e) => setCitizenFilters({...citizenFilters, incomeMax: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Has Income</label>
                        <select
                          value={citizenFilters.hasIncome}
                          onChange={(e) => setCitizenFilters({...citizenFilters, hasIncome: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <input
                          type="text"
                          placeholder="Search language..."
                          value={citizenFilters.language}
                          onChange={(e) => setCitizenFilters({...citizenFilters, language: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Residence */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location & Residence
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="Search location..."
                          value={citizenFilters.location}
                          onChange={(e) => setCitizenFilters({...citizenFilters, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Residence Type</label>
                        <select
                          value={citizenFilters.residenceType}
                          onChange={(e) => setCitizenFilters({...citizenFilters, residenceType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Types</option>
                          <option value="own_house">Own House</option>
                          <option value="rented_house">Rented House</option>
                          <option value="rented_flat">Rented Flat</option>
                          <option value="pg">PG</option>
                          <option value="hostel">Hostel</option>
                          <option value="family_house">Family House</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Registration Date Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Registration Period
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                          type="date"
                          value={citizenFilters.registrationDateFrom}
                          onChange={(e) => setCitizenFilters({...citizenFilters, registrationDateFrom: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                          type="date"
                          value={citizenFilters.registrationDateTo}
                          onChange={(e) => setCitizenFilters({...citizenFilters, registrationDateTo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setCitizenFilters({
                        gender: '',
                        caste: '',
                        religion: '',
                        occupation: '',
                        verificationStatus: '',
                        isActive: '',
                        search: '',
                        ageMin: '',
                        ageMax: '',
                        incomeMin: '',
                        incomeMax: '',
                        residenceType: '',
                        language: '',
                        hasIncome: '',
                        registrationDateFrom: '',
                        registrationDateTo: '',
                        location: ''
                      })}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear All Filters</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {citizens.length} citizens found
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Citizens Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Citizens Database</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchCitizens}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {citizensLoading ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Table Header Skeleton */}
                      <div className="flex space-x-6 py-3 border-b border-gray-200">
                        <SkeletonLoader type="text" width="120px" height="16px" />
                        <SkeletonLoader type="text" width="100px" height="16px" />
                        <SkeletonLoader type="text" width="100px" height="16px" />
                        <SkeletonLoader type="text" width="80px" height="16px" />
                        <SkeletonLoader type="text" width="100px" height="16px" />
                        <SkeletonLoader type="text" width="80px" height="16px" />
                      </div>
                      {/* Table Rows Skeleton */}
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-6 py-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <SkeletonLoader type="avatar" width="40px" height="40px" />
                            <div className="space-y-2">
                              <SkeletonLoader type="text" width="120px" height="16px" />
                              <SkeletonLoader type="text" width="150px" height="14px" />
                              <SkeletonLoader type="text" width="100px" height="14px" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <SkeletonLoader type="text" width="80px" height="14px" />
                            <SkeletonLoader type="text" width="60px" height="14px" />
                            <SkeletonLoader type="text" width="70px" height="14px" />
                          </div>
                          <div className="space-y-2">
                            <SkeletonLoader type="text" width="100px" height="14px" />
                            <SkeletonLoader type="text" width="80px" height="14px" />
                          </div>
                          <SkeletonLoader type="text" width="80px" height="20px" />
                          <SkeletonLoader type="text" width="100px" height="14px" />
                          <div className="flex space-x-2">
                            <SkeletonLoader type="button" width="32px" height="32px" />
                            <SkeletonLoader type="button" width="32px" height="32px" />
                            <SkeletonLoader type="button" width="32px" height="32px" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : citizens.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No citizens found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                    <button
                      onClick={() => setCitizenFilters({
                        gender: '',
                        caste: '',
                        religion: '',
                        occupation: '',
                        verificationStatus: '',
                        isActive: '',
                        search: '',
                        ageMin: '',
                        ageMax: '',
                        incomeMin: '',
                        incomeMax: '',
                        residenceType: '',
                        language: '',
                        hasIncome: '',
                        registrationDateFrom: '',
                        registrationDateTo: '',
                        location: ''
                      })}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Citizen</span>
                              {sortField === 'name' && (
                                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('gender')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Demographics</span>
                              {sortField === 'gender' && (
                                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('occupation')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Occupation</span>
                              {sortField === 'occupation' && (
                                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('verificationStatus')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Status</span>
                              {sortField === 'verificationStatus' && (
                                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('createdAt')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Registered</span>
                              {sortField === 'createdAt' && (
                                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {citizens.map((citizen) => (
                          <tr key={citizen._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {citizen.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{citizen.name}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {citizen.email}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {citizen.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div>Gender: {citizen.gender || 'Not specified'}</div>
                                <div>Caste: {getCasteLabel(citizen.caste)}</div>
                                <div>Religion: {getReligionLabel(citizen.religion)}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div>{citizen.occupation || 'Not specified'}</div>
                                <div className="text-gray-500">{citizen.salary || 'Not specified'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(citizen.verificationStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(citizen.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedCitizen(citizen);
                                    setShowCitizenModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateCitizenVerification(citizen._id, 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateCitizenVerification(citizen._id, 'rejected')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="lg:hidden space-y-4">
                    {citizens.map((citizen) => (
                      <div key={citizen._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-lg font-medium text-blue-600">
                                {citizen.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{citizen.name}</h3>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {citizen.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {citizen.phone}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(citizen.verificationStatus)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</label>
                            <p className="text-sm text-gray-900">{citizen.gender || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Caste</label>
                            <p className="text-sm text-gray-900">{getCasteLabel(citizen.caste)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</label>
                            <p className="text-sm text-gray-900">{citizen.occupation || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</label>
                            <p className="text-sm text-gray-900 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(citizen.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCitizen(citizen);
                                setShowCitizenModal(true);
                              }}
                              className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => updateCitizenVerification(citizen._id, 'approved')}
                              className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:text-green-700 border border-green-300 rounded-lg hover:bg-green-50"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => updateCitizenVerification(citizen._id, 'rejected')}
                              className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
                            >
                              <UserX className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Citizen Details Modal */}
        {showCitizenModal && selectedCitizen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {selectedCitizen.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCitizen.name}</h2>
                      <p className="text-blue-100 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedCitizen.email}
                      </p>
                      <p className="text-blue-100 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedCitizen.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-blue-100">Status</div>
                      {getStatusBadge(selectedCitizen.verificationStatus)}
                    </div>
                    <button
                      onClick={() => setShowCitizenModal(false)}
                      className="text-white hover:text-blue-200 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                            <p className="text-sm text-gray-900 font-medium">{selectedCitizen.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                            <p className="text-sm text-gray-900">
                              {selectedCitizen.dateOfBirth ? new Date(selectedCitizen.dateOfBirth).toLocaleDateString() : 'Not specified'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Gender</label>
                            <p className="text-sm text-gray-900">{selectedCitizen.gender || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Shield className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Aadhaar Number</label>
                            <p className="text-sm text-gray-900">{selectedCitizen.aadhaarNumber || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Family Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        Family Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Father's Name</label>
                          <p className="text-sm text-gray-900">{selectedCitizen.fatherName || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                          <p className="text-sm text-gray-900">{selectedCitizen.motherName || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Native Place</label>
                          <p className="text-sm text-gray-900">{selectedCitizen.nativePlace || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demographics & Professional */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                        Demographics
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Caste</label>
                            <p className="text-sm text-gray-900">{getCasteLabel(selectedCitizen.caste)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Religion</label>
                            <p className="text-sm text-gray-900">{getReligionLabel(selectedCitizen.religion)}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Languages Spoken</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedCitizen.languagesSpoken?.map((lang, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {lang}
                              </span>
                            )) || <span className="text-sm text-gray-500">Not specified</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-600" />
                        Professional Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Occupation</label>
                          <p className="text-sm text-gray-900">{selectedCitizen.occupation || 'Not specified'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Salary</label>
                            <p className="text-sm text-gray-900">{selectedCitizen.salary || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Has Income</label>
                            <p className="text-sm text-gray-900">{selectedCitizen.hasIncome || 'Not specified'}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Residence Type</label>
                          <p className="text-sm text-gray-900">
                            {selectedCitizen.residenceType ? selectedCitizen.residenceType.replace('_', ' ').toUpperCase() : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Status */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-red-600" />
                        Location Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <p className="text-sm text-gray-900">
                            {selectedCitizen.location?.address || 'Not specified'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">City</label>
                            <p className="text-sm text-gray-900">{selectedCitizen.location?.city || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">State</label>
                            <p className="text-sm text-gray-900">{selectedCitizen.location?.state || 'Not specified'}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Pincode</label>
                          <p className="text-sm text-gray-900">{selectedCitizen.location?.pincode || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        Account Status
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Verification Status</label>
                          <div className="mt-1">{getStatusBadge(selectedCitizen.verificationStatus)}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Account Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedCitizen.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedCitizen.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Registration Date</label>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedCitizen.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateCitizenVerification(selectedCitizen._id, 'approved')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => updateCitizenVerification(selectedCitizen._id, 'rejected')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowCitizenModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Analytics />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
