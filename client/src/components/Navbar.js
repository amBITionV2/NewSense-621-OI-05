import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Shield,
  MapPin,
  Video,
  Languages,
  Home,
  Plus,
  Users,
  Heart
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
        isActive(to)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Citizen Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={Home}>
                  Dashboard
                </NavLink>
                
                {/* Show Report Issue and Learn only for non-admin users */}
                {user?.role !== 'admin' && (
                  <>
                    <NavLink to="/complaints/create" icon={Plus}>
                      Report Issue
                    </NavLink>
                    <NavLink to="/videos" icon={Video}>
                      Learn
                    </NavLink>
                  </>
                )}
                
                <NavLink to="/community" icon={Users}>
                  Community
                </NavLink>
                
                {/* Show volunteer section for citizens (non-admin, non-volunteer) */}
                {user?.role !== 'admin' && user?.role !== 'volunteer' && (
                  <NavLink to="/citizen/volunteer/register" icon={Heart}>
                    Become a Volunteer
                  </NavLink>
                )}
                
                {/* Show volunteer dashboard for volunteers */}
                {user?.role === 'volunteer' && (
                  <NavLink to="/volunteer/dashboard" icon={Heart}>
                    Volunteer Dashboard
                  </NavLink>
                )}
                
                {user?.role === 'admin' && (
                  <NavLink to="/admin" icon={Shield}>
                    Admin
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/volunteer/login">Volunteer Login</NavLink>
                <NavLink to="/volunteer/register">Volunteer Register</NavLink>
              </>
            )}
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    icon={Home}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  
                  {/* Show Report Issue and Learn only for non-admin users */}
                  {user?.role !== 'admin' && (
                    <>
                      <NavLink 
                        to="/complaints/create" 
                        icon={Plus}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Report Issue
                      </NavLink>
                      <NavLink 
                        to="/videos" 
                        icon={Video}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Learn
                      </NavLink>
                    </>
                  )}
                  
                  <NavLink 
                    to="/community" 
                    icon={Users}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Community
                  </NavLink>
                  
                  {/* Show volunteer section for citizens (non-admin, non-volunteer) */}
                  {user?.role !== 'admin' && user?.role !== 'volunteer' && (
                    <NavLink 
                      to="/citizen/volunteer/register" 
                      icon={Heart}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become a Volunteer
                    </NavLink>
                  )}
                  
                  {/* Show volunteer dashboard for volunteers */}
                  {user?.role === 'volunteer' && (
                    <NavLink 
                      to="/volunteer/dashboard" 
                      icon={Heart}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Volunteer Dashboard
                    </NavLink>
                  )}
                  
                  {user?.role === 'admin' && (
                    <NavLink 
                      to="/admin" 
                      icon={Shield}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </NavLink>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <NavLink 
                      to="/profile" 
                      icon={Settings}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded-lg"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </NavLink>
                  <NavLink to="/volunteer/login" onClick={() => setIsMenuOpen(false)}>
                    Volunteer Login
                  </NavLink>
                  <NavLink to="/volunteer/register" onClick={() => setIsMenuOpen(false)}>
                    Volunteer Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
