import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Calendar,
  User,
  MapPin,
  Briefcase,
  Heart
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/analytics');
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const getRandomColor = (index) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    return colors[index % colors.length];
  };

  const prepareChartData = (data, title) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = labels.map((_, index) => getRandomColor(index));

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '80'),
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareBarChartData = (data, title) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = labels.map((_, index) => getRandomColor(index));

    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: colors.map(color => color + '80'),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">No analytics data available</div>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Demographic insights and user analytics
              </p>
            </div>
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gender Groups</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(analyticsData.gender).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Religions</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(analyticsData.religion).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupations</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(analyticsData.occupation).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gender Distribution - Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Gender Distribution</h3>
            </div>
            <div className="h-80">
              <Pie 
                data={prepareChartData(analyticsData.gender, 'Gender')} 
                options={chartOptions} 
              />
            </div>
          </div>

          {/* Religion Distribution - Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Heart className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Religion Distribution</h3>
            </div>
            <div className="h-80">
              <Pie 
                data={prepareChartData(analyticsData.religion, 'Religion')} 
                options={chartOptions} 
              />
            </div>
          </div>

          {/* Age Distribution - Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Calendar className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Age Distribution</h3>
            </div>
            <div className="h-80">
              <Bar 
                data={prepareBarChartData(analyticsData.age, 'Users')} 
                options={barChartOptions} 
              />
            </div>
          </div>

          {/* Caste Distribution - Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <MapPin className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Caste Distribution</h3>
            </div>
            <div className="h-80">
              <Bar 
                data={prepareBarChartData(analyticsData.caste, 'Users')} 
                options={barChartOptions} 
              />
            </div>
          </div>

          {/* Occupation Distribution - Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center mb-6">
              <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Occupation Distribution</h3>
            </div>
            <div className="h-80">
              <Bar 
                data={prepareBarChartData(analyticsData.occupation, 'Users')} 
                options={barChartOptions} 
              />
            </div>
          </div>
        </div>

        {/* Registration Trends */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Registration Trends (Last 12 Months)</h3>
            </div>
            <div className="h-80">
              <Bar 
                data={prepareBarChartData(analyticsData.registrationTrends, 'Registrations')} 
                options={{
                  ...barChartOptions,
                  plugins: {
                    ...barChartOptions.plugins,
                    legend: {
                      display: false,
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
