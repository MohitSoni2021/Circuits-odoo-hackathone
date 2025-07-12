import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Trash2, Users, Package, AlertTriangle, Activity } from 'lucide-react';

const Admin = () => {
  const { items, updateItem, deleteItem } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h2>
          <p className="text-amber-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const pendingItems = items.filter(item => !item.approved);
  const approvedItems = items.filter(item => item.approved);
  const allItems = items;

  const handleApprove = (itemId: string) => {
    updateItem(itemId, { approved: true });
  };

  const handleReject = (itemId: string) => {
    deleteItem(itemId);
  };

  const tabs = [
    { id: 'pending', label: 'Pending Approval', count: pendingItems.length, icon: AlertTriangle },
    { id: 'approved', label: 'Approved Items', count: approvedItems.length, icon: Check },
    { id: 'all', label: 'All Items', count: allItems.length, icon: Package },
    { id: 'overview', label: 'Overview', icon: Activity }
  ];

  const getItemsForTab = () => {
    switch (activeTab) {
      case 'pending':
        return pendingItems;
      case 'approved':
        return approvedItems;
      case 'all':
        return allItems;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-amber-200/20 shadow-lg">
            <h1 className="text-4xl font-bold text-amber-800 mb-2">Admin Panel</h1>
            <p className="text-amber-600 text-lg">Manage and moderate platform content</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Total Items</p>
                <p className="text-3xl font-bold text-amber-800">{allItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-amber-800">{pendingItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Approved</p>
                <p className="text-3xl font-bold text-amber-800">{approvedItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 font-medium">Active Users</p>
                <p className="text-3xl font-bold text-amber-800">1.2k</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="backdrop-blur-md bg-white/20 rounded-2xl border border-amber-200/20 shadow-lg mb-8">
          <div className="flex border-b border-amber-200/20 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-all duration-300 flex items-center justify-center space-x-2 min-w-max ${
                    activeTab === tab.id
                      ? 'text-amber-800 bg-amber-100/30 border-b-2 border-amber-600'
                      : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-amber-200/50 text-amber-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-amber-800 mb-4">Platform Overview</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 border border-amber-200/30">
                    <h4 className="text-lg font-semibold text-amber-800 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700">New items submitted</span>
                        <span className="font-bold text-amber-800">{pendingItems.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700">Items approved today</span>
                        <span className="font-bold text-amber-800">
                          {approvedItems.filter(item => 
                            new Date(item.createdAt).toDateString() === new Date().toDateString()
                          ).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700">Total active listings</span>
                        <span className="font-bold text-amber-800">{approvedItems.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 border border-amber-200/30">
                    <h4 className="text-lg font-semibold text-amber-800 mb-4">Category Breakdown</h4>
                    <div className="space-y-3">
                      {Object.entries(
                        approvedItems.reduce((acc, item) => {
                          acc[item.category] = (acc[item.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-amber-700">{category}</span>
                          <span className="font-bold text-amber-800">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-amber-800">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h3>
                </div>

                {getItemsForTab().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getItemsForTab().map((item) => (
                      <div key={item.id} className="backdrop-blur-sm bg-white/30 rounded-xl overflow-hidden border border-amber-200/30 shadow-lg">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.images[0] || '/placeholder-image.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h5 className="font-bold text-amber-800 mb-2">{item.title}</h5>
                          <p className="text-amber-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-amber-700 bg-amber-100/50 px-2 py-1 rounded-full">
                              {item.size}
                            </span>
                            <span className="font-bold text-amber-800">{item.pointsRequired} pts</span>
                          </div>

                          <div className="text-xs text-amber-600 mb-3">
                            <p>By: {item.uploaderName}</p>
                            <p>Listed: {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {!item.approved && (
                              <>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="flex-1 px-3 py-2 bg-green-100/50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200/50 transition-colors duration-300 flex items-center justify-center space-x-1"
                                >
                                  <Check className="h-4 w-4" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleReject(item.id)}
                                  className="flex-1 px-3 py-2 bg-red-100/50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200/50 transition-colors duration-300 flex items-center justify-center space-x-1"
                                >
                                  <X className="h-4 w-4" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            
                            {item.approved && (
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="px-3 py-2 bg-red-100/50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200/50 transition-colors duration-300 flex items-center space-x-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                    <p className="text-amber-600 text-lg">No items found</p>
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

export default Admin;