import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Coffee, Sparkles } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await signup(email, password, name);
      }

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-200"></div>
        <div className="absolute bottom-20 left-40 w-36 h-36 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-400"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 shadow-2xl border border-amber-200/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg">
                <Coffee className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-amber-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Join ReWear'}
            </h2>
            <p className="text-amber-600">
              {isLogin 
                ? 'Sign in to continue your sustainable fashion journey' 
                : 'Start your sustainable fashion journey today'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-100/50 border border-red-200/50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mb-6 p-4 rounded-xl bg-amber-100/50 border border-amber-200/50">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-800">Demo Credentials</span>
            </div>
            <div className="text-xs text-amber-700 space-y-1">
              <div><strong>Admin:</strong> admin@rewear.com / admin</div>
              <div><strong>User:</strong> Any email / Any password</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-500 hover:text-amber-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;