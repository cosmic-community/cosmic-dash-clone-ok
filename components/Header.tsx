import Link from 'next/link'
import { Search, ShoppingCart } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">FoodDash</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Restaurants
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Orders
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-primary transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-gray-700 hover:text-primary transition-colors duration-200 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}