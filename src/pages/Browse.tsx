import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, Heart, MapPin } from 'lucide-react';

const Browse = () => {
  const { items } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const approvedItems = items.filter(item => item.approved);
  
  const filteredItems = approvedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSize = !selectedSize || item.size === selectedSize;
    
    return matchesSearch && matchesCategory && matchesSize;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'points-low':
        return a.pointsRequired - b.pointsRequired;
      case 'points-high':
        return b.pointsRequired - a.pointsRequired;
      default:
        return 0;
    }
  });

  const categories = [...new Set(approvedItems.map(item => item.category))];
  const sizes = [...new Set(approvedItems.map(item => item.size))];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-amber-200/20 shadow-lg">
            <h1 className="text-4xl font-bold text-amber-800 mb-2">Browse Items</h1>
            <p className="text-amber-600 text-lg">Discover amazing clothing pieces from our community</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="points-low">Points: Low to High</option>
                  <option value="points-high">Points: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-amber-600">
                {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-amber-100/50 text-amber-800' 
                      : 'text-amber-600 hover:bg-amber-50/30'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-amber-100/50 text-amber-800' 
                      : 'text-amber-600 hover:bg-amber-50/30'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid/List */}
        {sortedItems.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {sortedItems.map((item) => (
              <Link
                key={item._id}
                to={`/item/${item._id}`}
                className={`group block backdrop-blur-md bg-white/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/30`}
              >
                <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} overflow-hidden`}>
                  <img
                    src={item.images[0] || '/placeholder-image.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-amber-800 group-hover:text-amber-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <Heart className="h-5 w-5 text-amber-400 hover:text-red-500 transition-colors duration-300 cursor-pointer" />
                  </div>
                  
                  <p className="text-amber-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs font-medium text-amber-700 bg-amber-100/50 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-amber-700 bg-amber-100/50 px-3 py-1 rounded-full">
                        Size {item.size}
                      </span>
                      <span className="text-sm font-medium text-green-700 bg-green-100/50 px-3 py-1 rounded-full">
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-amber-600">{item.uploaderName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="font-bold text-amber-800">{item.pointsRequired}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="backdrop-blur-md bg-white/20 rounded-3xl p-12 border border-amber-200/20 shadow-lg max-w-md mx-auto">
              <Search className="h-16 w-16 text-amber-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-amber-800 mb-4">No items found</h3>
              <p className="text-amber-600 mb-6">
                Try adjusting your search criteria or browse all items
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedSize('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
