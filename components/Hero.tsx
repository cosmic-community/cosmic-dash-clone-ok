export default function Hero() {
  return (
    <div className="relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2000&h=1200&fit=crop&auto=format,compress"
          alt="Delicious food spread"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Delicious Food
          <span className="block text-primary">Delivered Fast</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Discover amazing restaurants and get your favorite meals delivered right to your door
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-3 pr-12 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <a
            href="#restaurants"
            className="btn-primary inline-block px-8 py-3 text-lg font-semibold bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg"
          >
            Browse Restaurants
          </a>
          <a
            href="/orders"
            className="btn-secondary inline-block px-8 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Track Order
          </a>
        </div>
      </div>
    </div>
  )
}