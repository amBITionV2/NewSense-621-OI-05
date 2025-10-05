import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Heart,
  Users,
  Clock,
  Award,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Plus,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Search,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    totalHours: 0,
    rating: 0,
    points: 0,
    badge: {
      rank: 'bronze',
      level: 1,
      nextRankPoints: 100
    },
    achievements: []
  });
  const [tasks, setTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch volunteer's tasks
      const myTasksResponse = await axios.get('/api/volunteers/my-tasks');
      const myTasks = myTasksResponse.data.tasks || [];
      setTasks(myTasks);

      // Fetch available tasks
      const availableTasksResponse = await axios.get('/api/volunteers/tasks');
      const availableTasks = availableTasksResponse.data.tasks || [];
      console.log('Available tasks response:', availableTasksResponse.data);
      console.log('Available tasks:', availableTasks);
      setAvailableTasks(availableTasks);

      // Calculate stats using the fetched tasks
      const completedTasks = myTasks.filter(task => task.status === 'completed').length;
      const activeTasks = myTasks.filter(task => ['assigned', 'in_progress'].includes(task.status)).length;
      
      setStats({
        totalTasks: myTasks.length,
        completedTasks,
        activeTasks,
        totalHours: user?.totalHoursVolunteered || 0,
        rating: user?.averageRating || 0,
        points: user?.points || 0,
        badge: user?.badge || { rank: 'bronze', level: 1, nextRankPoints: 100 },
        achievements: user?.achievements || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty data to prevent crashes
      setTasks([]);
      setAvailableTasks([]);
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        activeTasks: 0,
        totalHours: 0,
        rating: 0,
        points: 0,
        badge: { rank: 'bronze', level: 1, nextRankPoints: 100 },
        achievements: []
      });
    } finally {
      setLoading(false);
    }
  };

  const applyForTask = async (taskId) => {
    try {
      await axios.post(`/api/volunteers/tasks/${taskId}/apply`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error applying for task:', error);
      // Show user-friendly error message
      alert('Failed to apply for task. Please try again.');
    }
  };

  const updateTaskStatus = async (taskId, status, feedback, rating, hoursWorked) => {
    try {
      await axios.put(`/api/volunteers/tasks/${taskId}/status`, {
        status,
        feedback,
        rating,
        hoursWorked
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating task status:', error);
      // Show user-friendly error message
      alert('Failed to update task status. Please try again.');
    }
  };

  const testHardcodedTasks = async () => {
    try {
      const response = await axios.get('/api/volunteers/test-tasks');
      console.log('Test tasks response:', response.data);
      alert(`Test successful! Found ${response.data.count} hardcoded tasks. Check console for details.`);
    } catch (error) {
      console.error('Error testing hardcoded tasks:', error);
      alert('Error testing hardcoded tasks. Check console for details.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeColor = (rank) => {
    switch (rank) {
      case 'bronze': return 'from-amber-600 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      case 'diamond': return 'from-blue-400 to-cyan-600';
      default: return 'from-amber-600 to-orange-600';
    }
  };

  const getBadgeIcon = (rank) => {
    switch (rank) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      case 'diamond': return '💠';
      default: return '🥉';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(stats.badge.rank)} text-white text-sm font-semibold flex items-center space-x-1`}>
                    <span>{getBadgeIcon(stats.badge.rank)}</span>
                    <span className="capitalize">{stats.badge.rank} Level {stats.badge.level}</span>
                  </div>
                </div>
                <p className="text-gray-600">Welcome back, {user?.name || 'Volunteer'}! • {stats.points} points</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={testHardcodedTasks}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium"
              >
                Test Tasks
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.activeTasks}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Volunteered</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalHours}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.points}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.badge.nextRankPoints} to next rank
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Badge Progress Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Performance Rating</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(stats.rating) ? 'text-yellow-300' : 'text-yellow-100'
                        }`}
                        fill={i < Math.floor(stats.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{stats.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-100">Based on {stats.completedTasks} completed tasks</p>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-r ${getBadgeColor(stats.badge.rank)} rounded-xl shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Badge Progress</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{getBadgeIcon(stats.badge.rank)}</span>
                  <span className="text-xl font-bold capitalize">{stats.badge.rank} Level {stats.badge.level}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (stats.points % 100) / 100 * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm mt-2 opacity-90">
                  {stats.badge.nextRankPoints} points to next rank
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        {stats.achievements.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.achievements.slice(-6).map((achievement, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{achievement.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'my-tasks', label: 'My Tasks', icon: Award },
                { id: 'available', label: 'Available Tasks', icon: Plus }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-600 mb-4">Start by applying for available volunteer tasks</p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Browse Available Tasks
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.description ? task.description.substring(0, 100) + '...' : 'No description available'}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'my-tasks' && (
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned tasks</h3>
                    <p className="text-gray-600">You haven't been assigned any tasks yet</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-gray-600 mt-1">{task.description || 'No description available'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {task.location?.address || 'Location not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {task.estimatedDuration?.hours || 0} hours
                        </div>
                      </div>

                      {task.status === 'assigned' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateTaskStatus(task._id, 'in_progress')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start Task</span>
                          </button>
                        </div>
                      )}

                      {task.status === 'in_progress' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateTaskStatus(task._id, 'completed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark Complete</span>
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task._id, 'assigned')}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                          >
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'available' && (
              <div className="space-y-4">
                {/* Task Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Available Volunteer Opportunities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">
                        <strong>{availableTasks.filter(t => t.isComplaintTask).length}</strong> Issue Reports from Citizens
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">
                        <strong>{availableTasks.filter(t => t.isHardcoded).length}</strong> Community Service Tasks
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        <strong>{availableTasks.length}</strong> Total Opportunities
                      </span>
                    </div>
                  </div>
                  {/* Debug Info */}
                  <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    <strong>Debug Info:</strong> {availableTasks.length} total tasks loaded. 
                    Hardcoded: {availableTasks.filter(t => t.isHardcoded).length}, 
                    Complaints: {availableTasks.filter(t => t.isComplaintTask).length}
                  </div>
                </div>

                {/* Task Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    All Tasks ({availableTasks.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    Issue Reports ({availableTasks.filter(t => t.isComplaintTask).length})
                  </button>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Community Tasks ({availableTasks.filter(t => t.isHardcoded).length})
                  </button>
                </div>

                {availableTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No available tasks</h3>
                    <p className="text-gray-600">Check back later for new volunteer opportunities</p>
                  </div>
                ) : (
                  availableTasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-gray-600 mt-1">{task.description || 'No description available'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {task.location?.address || 'Location not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {task.estimatedDuration?.hours || 0} hours
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{task.currentVolunteers}</span> / {task.maxVolunteers} volunteers
                          </div>
                          {task.isComplaintTask && (
                            <div className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                              📋 Issue Report
                            </div>
                          )}
                          {task.isHardcoded && (
                            <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              🎯 Community Task
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => applyForTask(task._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Apply</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
