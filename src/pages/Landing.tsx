import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowRight, Recycle, Users, Award, ChevronLeft, ChevronRight, Sparkles, Leaf, Heart, Shirt, Scissors, RefreshCw } from 'lucide-react';

const Landing = () => {
  const { items } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredItems = items.filter(item => item.approved).slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredItems.length - 2));
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredItems.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, featuredItems.length - 2)) % Math.max(1, featuredItems.length - 2));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with clothing pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-200"></div>
          <div className="absolute bottom-20 left-40 w-36 h-36 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-400"></div>
          
          {/* Floating clothing icons */}
          <div className="absolute top-32 left-1/4 animate-bounce delay-1000">
            <Shirt className="h-8 w-8 text-gray-400 opacity-30" />
          </div>
          <div className="absolute bottom-32 right-1/4 animate-bounce delay-2000">
            <Shirt className="h-6 w-6 text-gray-500 opacity-40 rotate-45" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="backdrop-blur-sm bg-white/80 rounded-3xl p-8 md:p-12 border border-gray-200/30 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <RefreshCw className="h-8 w-8 text-gray-700 animate-spin mr-3" />
              <span className="text-gray-800 font-semibold text-lg">Sustainable Fashion Revolution</span>
              <Scissors className="h-8 w-8 text-gray-700 ml-3" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent animate-fadeIn">
              Swap. Style. Sustain.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-800 mb-4 max-w-4xl mx-auto leading-relaxed">
              Give your wardrobe a fresh start while giving clothes a second life
            </p>
            
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Exchange pre-loved clothing with our community. Earn points for every item you share, discover unique pieces, and join the sustainable fashion movement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/browse"
                className="group px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <Shirt className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Browse Clothes
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/add-item"
                className="px-8 py-4 backdrop-blur-md bg-white/60 text-gray-800 rounded-xl font-semibold text-lg hover:bg-white/80 transition-all duration-300 border border-gray-300/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                List Your Clothes
              </Link>
            </div>

            {/* Fashion Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">2.5k+</div>
                <div className="text-gray-700 font-medium">Clothes Exchanged</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">1.2k+</div>
                <div className="text-gray-700 font-medium">Fashion Lovers</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">500kg</div>
                <div className="text-gray-700 font-medium">Textile Waste Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50/50 to-gray-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Clothing Exchange Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Simple steps to refresh your wardrobe sustainably
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shirt className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-800 font-bold">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">List Your Clothes</h3>
              <p className="text-gray-700 leading-relaxed">
                Upload photos of clothes you no longer wear. Add details like size, condition, and style. Earn points for every item you list!
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-800 font-bold">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse & Discover</h3>
              <p className="text-gray-700 leading-relaxed">
                Explore unique pieces from our fashion community. Filter by size, style, brand, or color to find your perfect match.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <RefreshCw className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-800 font-bold">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Swap or Redeem</h3>
              <p className="text-gray-700 leading-relaxed">
                Exchange directly with other users or use your earned points to claim items. Enjoy your refreshed wardrobe!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      {featuredItems.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trending Fashion Finds
              </h2>
              <p className="text-xl text-gray-700">
                Discover amazing pre-loved pieces from our style community
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                >
                  {featuredItems.map((item) => (
                    <div key={item.id} className="w-1/3 flex-shrink-0 px-4">
                      <Link 
                        to={`/item/${item.id}`}
                        className="group block backdrop-blur-md bg-white/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/30"
                      >
                        <div className="aspect-square overflow-hidden relative">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 backdrop-blur-sm bg-white/20 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Heart className="h-4 w-4 text-white" />
                          </div>
                          <div className="absolute bottom-3 left-3 backdrop-blur-sm bg-black/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {item.condition}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-black">
                            {item.title}
                          </h3>
                          <p className="text-gray-700 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-800 bg-gray-100/80 px-3 py-1 rounded-full">
                                Size {item.size}
                              </span>
                              <span className="text-sm font-medium text-gray-700 bg-gray-200/60 px-3 py-1 rounded-full">
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">by {item.uploaderName}</span>
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4 text-gray-600 fill-current" />
                              <span className="font-bold text-gray-900">{item.pointsRequired} pts</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md bg-white/80 rounded-full border border-gray-200/30 text-gray-700 hover:bg-white/90 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md bg-white/80 rounded-full border border-gray-200/30 text-gray-700 hover:bg-white/90 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.max(1, featuredItems.length - 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-gray-700 scale-125' 
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50/50 to-gray-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Clothing Exchange?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Join the sustainable fashion movement and discover the benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 backdrop-blur-md bg-white/80 rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Eco-Friendly Fashion</h3>
              <p className="text-gray-700 leading-relaxed">
                Reduce fashion waste and environmental impact. Every swap saves textiles from landfills and reduces the demand for new clothing production.
              </p>
            </div>

            <div className="group p-8 backdrop-blur-md bg-white/80 rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Unique Style Finds</h3>
              <p className="text-gray-700 leading-relaxed">
                Discover one-of-a-kind pieces, vintage treasures, and designer items at a fraction of the cost. Build a unique wardrobe that reflects your personality.
              </p>
            </div>

            <div className="group p-8 backdrop-blur-md bg-white/80 rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn & Save</h3>
              <p className="text-gray-700 leading-relaxed">
                Earn points for every item you list and successful swap. Use points to claim items without direct exchanges. Turn your closet cleanout into rewards!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fashion Community Love
            </h2>
            <p className="text-xl text-gray-700">
              What our style-conscious community says about ReWear
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-white/80 rounded-2xl p-8 border border-gray-200/30 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah M.</h4>
                  <p className="text-gray-700 text-sm">Fashion Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-800 italic">
                "I've completely refreshed my wardrobe through ReWear! Found amazing vintage pieces and cleared out clothes I never wore. It's addictive!"
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/80 rounded-2xl p-8 border border-gray-200/30 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Maya K.</h4>
                  <p className="text-gray-700 text-sm">Sustainable Living Advocate</p>
                </div>
              </div>
              <p className="text-gray-800 italic">
                "Love that I can be fashionable while being environmentally conscious. The point system makes it so easy to get new pieces!"
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/80 rounded-2xl p-8 border border-gray-200/30 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Alex R.</h4>
                  <p className="text-gray-700 text-sm">College Student</p>
                </div>
              </div>
              <p className="text-gray-800 italic">
                "Perfect for my budget! I've built an amazing wardrobe without spending much. The community is so friendly and helpful."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-md bg-gradient-to-br from-gray-100/80 to-gray-200/60 rounded-3xl p-12 border border-gray-300/30 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <Shirt className="h-16 w-16 text-gray-700 mr-4 animate-pulse" />
              <RefreshCw className="h-16 w-16 text-gray-700 animate-spin" />
              <Shirt className="h-16 w-16 text-gray-700 ml-4 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Closet?
            </h2>
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              Join thousands of fashion lovers making sustainable choices. Start swapping today and discover your next favorite outfit!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <Users className="mr-2 h-5 w-5" />
                Join the Community
              </Link>
              <Link
                to="/browse"
                className="px-8 py-4 backdrop-blur-md bg-white/80 text-gray-800 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 border border-gray-300/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <Shirt className="mr-2 h-5 w-5" />
                Start Browsing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;