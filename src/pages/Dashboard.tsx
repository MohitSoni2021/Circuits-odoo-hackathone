import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { User, Award, Package, ArrowUpRight, Plus, Eye, Edit, Trash2, Calendar, Tag } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserItems, getUserSwapRequests, deleteItem } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const userItems = getUserItems(user.id);
  const userSwapRequests = getUserSwapRequests(user.id);
  const approvedItems = userItems.filter(item => item.approved);
  const pendingItems = userItems.filter(item => !item.approved);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'items', label: 'My Items', icon: Package },
    { id: 'swaps', label: 'Swaps', icon: ArrowUpRight }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-amber-200/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-amber-800">Welcome back, {user.name}!</h1>
                  <p className="text-amber-600">Manage your sustainable fashion journey</p>
                </div>
              </div>
              <Link
                to="/add-item"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>List New Item</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Total Points</p>
                <p className="text-3xl font-bold text-amber-800">{user.points}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Listed Items</p>
                <p className="text-3xl font-bold text-amber-800">{userItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Active Swaps</p>
                <p className="text-3xl font-bold text-amber-800">{userSwapRequests.filter(s => s.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-amber-800">{userSwapRequests.filter(s => s.status === 'accepted').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="backdrop-blur-md bg-white/20 rounded-2xl border border-amber-200/20 shadow-lg mb-8">
          <div className="flex border-b border-amber-200/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'text-amber-800 bg-amber-100/30 border-b-2 border-amber-600'
                      : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-amber-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {userSwapRequests.slice(0, 3).map((swap) => (
                      <div key={swap._id} className="flex items-center justify-between p-4 bg-amber-50/30 rounded-xl border border-amber-200/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            swap.status === 'pending' ? 'bg-yellow-400' :
                            swap.status === 'accepted' ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-amber-800 font-medium">
                            Swap request {swap.status}
                          </span>
                        </div>
                        <span className="text-amber-600 text-sm">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {userSwapRequests.length === 0 && (
                      <p className="text-amber-600 text-center py-8">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-amber-800">My Listed Items</h3>
                  <Link
                    to="/add-item"
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                  </Link>
                </div>

                {pendingItems.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-amber-700 mb-3">Pending Approval</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pendingItems.map((item) => (
                        <div key={item._id} className="backdrop-blur-sm bg-yellow-100/30 rounded-xl p-4 border border-yellow-200/50">
                          <div className="aspect-square bg-amber-100 rounded-lg mb-3 overflow-hidden">
                            <img
                              src={item.images[0] || '/placeholder-image.jpg'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h5 className="font-semibold text-amber-800 mb-1">{item.title}</h5>
                          <p className="text-amber-600 text-sm mb-2">Size: {item.size}</p>
                          <p className="text-yellow-700 text-sm font-medium">⏳ Pending approval</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-semibold text-amber-700 mb-3">Active Listings</h4>
                  {approvedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {approvedItems.map((item) => (
                        <div key={item._id} className="backdrop-blur-sm bg-white/30 rounded-xl overflow-hidden border border-amber-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={item.images[0] || '/placeholder-image.jpg'}
                              alt={item.title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h5 className="font-bold text-amber-800 mb-2">{item.title}</h5>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-amber-700 bg-amber-100/50 px-2 py-1 rounded-full">
                                {item.size}
                              </span>
                              <span className="font-bold text-amber-800">{item.pointsRequired} pts</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/item/${item._id}`}
                                className="flex-1 px-3 py-2 bg-amber-100/50 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200/50 transition-colors duration-300 flex items-center justify-center space-x-1"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </Link>
                              <button
                                onClick={() => deleteItem(item._id)}
                                className="px-3 py-2 bg-red-100/50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200/50 transition-colors duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                      <p className="text-amber-600 text-lg mb-2">No items listed yet</p>
                      <p className="text-amber-500 mb-4">Start by listing your first item</p>
                      <Link
                        to="/add-item"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 space-x-2"
                      >
                        <Plus className="h-5 w-5" />
                        <span>List Your First Item</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'swaps' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-amber-800">Swap Requests</h3>
                {userSwapRequests.length > 0 ? (
                  <div className="space-y-4">
                    {userSwapRequests.map((swap) => (
                      <div key={swap._id} className="backdrop-blur-sm bg-white/30 rounded-xl p-6 border border-amber-200/30 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${
                              swap.status === 'pending' ? 'bg-yellow-400' :
                              swap.status === 'accepted' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                            <div>
                              <p className="font-semibold text-amber-800">
                                {swap.fromUserId === user.id ? 'Sent' : 'Received'} swap request
                              </p>
                              <p className="text-amber-600 text-sm">Item ID: {swap.itemId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-amber-800 capitalize">{swap.status}</p>
                            <p className="text-amber-600 text-sm">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ArrowUpRight className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                    <p className="text-amber-600 text-lg mb-2">No swap requests yet</p>
                    <p className="text-amber-500 mb-4">Browse items to start swapping</p>
                    <Link
                      to="/browse"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 space-x-2"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                      <span>Start Browsing</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;