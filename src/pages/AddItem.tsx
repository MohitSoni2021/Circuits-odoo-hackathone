import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, getApiHeaders, API_CONFIG } from '../config/api';
import { Upload, X, Plus, Camera, Star } from 'lucide-react';

const AddItem = () => {
  const navigate = useNavigate();
  const { addItem } = useData();
  const { user, firebaseUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: [''],
    pointsRequired: 30
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Activewear', 'Formal'
  ];

  const types = {
    'Tops': ['T-Shirt', 'Shirt', 'Blouse', 'Tank Top', 'Sweater', 'Hoodie'],
    'Bottoms': ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings'],
    'Dresses': ['Casual Dress', 'Evening Dress', 'Summer Dress', 'Maxi Dress'],
    'Outerwear': ['Jacket', 'Coat', 'Blazer', 'Cardigan', 'Vest'],
    'Shoes': ['Sneakers', 'Heels', 'Flats', 'Boots', 'Sandals'],
    'Accessories': ['Bag', 'Belt', 'Hat', 'Scarf', 'Jewelry'],
    'Activewear': ['Sports Bra', 'Leggings', 'Shorts', 'Tank Top'],
    'Formal': ['Suit', 'Blazer', 'Dress Shirt', 'Formal Dress']
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '8', '10', '12', '14', '16'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firebaseUser) return;

    setLoading(true);

    try {
      const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
      
      const success = await addItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        size: formData.size,
        condition: formData.condition,
        tags: filteredTags,
        images: imageFiles, // Pass the actual File objects
        uploaderId: user.id,
        uploaderName: user.name,
        pointsRequired: formData.pointsRequired
      });

      if (success) {
        navigate('/dashboard');
      } else {
        alert('Failed to add item. Please try again.');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-amber-200/20 shadow-lg">
            <h1 className="text-4xl font-bold text-amber-800 mb-2">List New Item</h1>
            <p className="text-amber-600 text-lg">Share your unused clothing with the community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Upload */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Photos</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-amber-100/30 border border-amber-200/30">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/20 transition-all duration-300">
                  <Camera className="h-8 w-8 text-amber-400 mb-2" />
                  <span className="text-amber-600 font-medium">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <p className="text-amber-600 text-sm">Add up to 5 photos. First photo will be the main image.</p>
          </div>

          {/* Basic Information */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Vintage Denim Jacket"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Points Required *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="pointsRequired"
                    required
                    min="1"
                    max="500"
                    value={formData.pointsRequired}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                  <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  disabled={!formData.category}
                >
                  <option value="">Select Type</option>
                  {formData.category && types[formData.category as keyof typeof types]?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Size *
                </label>
                <select
                  name="size"
                  required
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Describe your item in detail..."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-amber-200/20 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Tags</h2>
            <p className="text-amber-600 mb-4">Add tags to help people find your item</p>
            
            <div className="space-y-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-amber-200/50 rounded-xl backdrop-blur-sm bg-white/30 text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., vintage, cotton, casual"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              {formData.tags.length < 5 && (
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center space-x-2 px-4 py-2 text-amber-600 hover:text-amber-700 transition-colors duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add another tag</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 backdrop-blur-md bg-white/30 text-amber-800 rounded-xl font-medium hover:bg-white/40 transition-all duration-300 border border-amber-200/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Listing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>List Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;