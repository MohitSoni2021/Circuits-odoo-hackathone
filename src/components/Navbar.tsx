import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Coffee, User, LogOut, Menu, X, ShoppingBag, Plus, Home, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-amber-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-transform duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ReWear
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                isActive('/') 
                  ? 'bg-gray-100/80 text-gray-900 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/browse"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                isActive('/browse') 
                  ? 'bg-gray-100/80 text-gray-900 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/add-item"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive('/add-item') 
                      ? 'bg-gray-100/80 text-gray-900 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>List Item</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive('/dashboard') 
                      ? 'bg-gray-100/80 text-gray-900 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-700">{user.points} points</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-gray-700 hover:bg-gray-50/80 transition-colors duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50/80 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 backdrop-blur-sm bg-white/80 rounded-lg mt-2 p-4 border border-gray-200/30">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gray-100/80 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-50/80'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isActive('/browse') 
                  ? 'bg-gray-100/80 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-50/80'
              }`}
            >
              Browse Items
            </Link>
            {user ? (
              <>
                <Link
                  to="/add-item"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive('/add-item') 
                      ? 'bg-gray-100/80 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  List Item
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-gray-100/80 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-200/30 pt-2 mt-2">
                  <div className="px-4 py-2">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-700">{user.points} points</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50/80 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium text-center transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;