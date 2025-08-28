import Link from 'next/link'
import { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const featuredImage = restaurant.metadata?.featured_image
  const rating = restaurant.metadata?.rating || 0
  const deliveryTime = restaurant.metadata?.delivery_time || 'N/A'
  const deliveryFee = restaurant.metadata?.delivery_fee || 0
  const cuisineType = restaurant.metadata?.cuisine_type?.value || 'Various'

  return (
    <Link href={`/restaurants/${restaurant.slug}`} className="group block">
      <div className="card hover:shadow-lg transition-all duration-200 group-hover:scale-105 overflow-hidden">
        <div className="relative">
          {featuredImage ? (
            <img
              src={`${featuredImage.imgix_url}?w=600&h=300&fit=crop&auto=format,compress`}
              alt={restaurant.title}
              className="w-full h-48 object-cover"
              width="300"
              height="192"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
          
          <div className="absolute top-4 right-4">
            <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
              {cuisineType}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {restaurant.metadata?.name || restaurant.title}
          </h3>
          
          {restaurant.metadata?.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {restaurant.metadata.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>{deliveryTime}</span>
              <span>${deliveryFee.toFixed(2)} delivery</span>
            </div>
          </div>
          
          {restaurant.metadata?.address && (
            <div className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{restaurant.metadata.address}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}