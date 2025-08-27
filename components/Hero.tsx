export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-accent text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Food delivery from your favorite restaurants
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Get your favorite food delivered in minutes. Fast, fresh, and always delicious.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Find Food
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}