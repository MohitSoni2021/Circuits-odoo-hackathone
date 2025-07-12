import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Heart, Star, MapPin, Calendar, Tag, ArrowUpRight, Award, User, ChevronLeft, ChevronRight } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, createSwapRequest } = useData();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapType, setSwapType] = useState<'points' | 'item'>('points');

  const item = items.find(item => item._id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Item not found</h2>
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const handleSwapRequest = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (swapType === 'points') {
      createSwapRequest({
        fromUserId: user.id,
        toUserId: item.uploaderId,
        itemId: item._id,
        pointsOffered: item.pointsRequired,
        status: 'pending'
      });
    }

    setShowSwapModal(false);
    alert('Swap request sent successfully!');
  };

  const canSwap = user && user.id !== item.uploaderId && item.status === 'available';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-amber-700 hover:text-amber-800 transition-colors duration-300 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative backdrop-blur-md bg-white/20 rounded-3xl overflow-hidden border border-amber-200/20 shadow-lg">
              <div className="aspect-square">
                <img
                  src={item.images[currentImageIndex] || '/placeholder-image.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md bg-white/30 rounded-full border border-amber-200/20 text-amber-700 hover:bg-white/50 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md bg-white/30 rounded-full border border-amber-200/20 text-amber-700 hover:bg-white/50 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <button className="absolute top-4 right-4 p-3 backdrop-blur-md bg-white/30 rounded-full border border-amber-200/20 text-amber-700 hover:bg-white/50 transition-all duration-300 hover:scale-110">
                <Heart className="h-6 w-6 hover:text-red-500 transition-colors duration-300" />
              </button>
            </div>

            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'border-amber-600 scale-105' 
                        : 'border-amber-200/30 hover:border-amber-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 border border-amber-200/20 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-amber-800 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-amber-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{item.uploaderName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-amber-100/50 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-amber-600 fill-current" />
                  <span className="text-2xl font-bold text-amber-800">{item.pointsRequired}</span>
                </div>
              </div>

              <p className="text-amber-700 text-lg leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Item Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 border border-amber-200/20">
                  <h3 className="font-semibold text-amber-800 mb-1">Category</h3>
                  <p className="text-amber-600">{item.category}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 border border-amber-200/20">
                  <h3 className="font-semibold text-amber-800 mb-1">Type</h3>
                  <p className="text-amber-600">{item.type}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 border border-amber-200/20">
                  <h3 className="font-semibold text-amber-800 mb-1">Size</h3>
                  <p className="text-amber-600">{item.size}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 border border-amber-200/20">
                  <h3 className="font-semibold text-amber-800 mb-1">Condition</h3>
                  <p className="text-amber-600">{item.condition}</p>
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-sm font-medium text-amber-700 bg-amber-100/50 px-3 py-1 rounded-full border border-amber-200/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  item.status === 'available' 
                    ? 'bg-green-100/50 text-green-700 border border-green-200/50' 
                    : 'bg-yellow-100/50 text-yellow-700 border border-yellow-200/50'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    item.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  {item.status === 'available' ? 'Available for swap' : 'Currently unavailable'}
                </div>
              </div>

              {/* Action Buttons */}
              {canSwap ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setSwapType('points');
                      setShowSwapModal(true);
                    }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <Award className="h-5 w-5" />
                    <span>Redeem with Points</span>
                  </button>
                  <button
                    onClick={() => {
                      setSwapType('item');
                      setShowSwapModal(true);
                    }}
                    className="flex-1 px-6 py-4 backdrop-blur-md bg-white/30 text-amber-800 rounded-xl font-semibold text-lg hover:bg-white/40 transition-all duration-300 border border-amber-200/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                    <span>Request Item Swap</span>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  {!user ? (
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Sign in to Swap
                    </button>
                  ) : item.status !== 'available' ? (
                    <p className="text-amber-600 font-medium">This item is currently not available for swap</p>
                  ) : (
                    <p className="text-amber-600 font-medium">You cannot swap your own item</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 max-w-md w-full border border-amber-200/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              {swapType === 'points' ? 'Redeem with Points' : 'Request Item Swap'}
            </h3>
            
            {swapType === 'points' ? (
              <div>
                <p className="text-amber-600 mb-4">
                  You'll use <strong>{item.pointsRequired} points</strong> to get this item.
                </p>
                <p className="text-amber-700 mb-6">
                  Current balance: <strong>{user?.points || 0} points</strong>
                </p>
                {(user?.points || 0) >= item.pointsRequired ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSwapRequest}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300"
                    >
                      Confirm Redemption
                    </button>
                    <button
                      onClick={() => setShowSwapModal(false)}
                      className="flex-1 px-6 py-3 backdrop-blur-md bg-white/50 text-amber-800 rounded-xl font-medium hover:bg-white/70 transition-all duration-300 border border-amber-200/50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-600 mb-4">
                      You need {item.pointsRequired - (user?.points || 0)} more points.
                    </p>
                    <button
                      onClick={() => setShowSwapModal(false)}
                      className="w-full px-6 py-3 backdrop-blur-md bg-white/50 text-amber-800 rounded-xl font-medium hover:bg-white/70 transition-all duration-300 border border-amber-200/50"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-amber-600 mb-6">
                  Send a swap request to the item owner. They'll review your request and respond accordingly.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSwapRequest}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    Send Request
                  </button>
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="flex-1 px-6 py-3 backdrop-blur-md bg-white/50 text-amber-800 rounded-xl font-medium hover:bg-white/70 transition-all duration-300 border border-amber-200/50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;