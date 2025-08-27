import Link from 'next/link'
import { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const featuredImage = restaurant.metadata?.featured_image
  const rating = restaurant.metadata?.rating || 0
  const deliveryTime = restaurant.metadata?.delivery_time
  const deliveryFee = restaurant.metadata?.delivery_fee
  const cuisineType = restaurant.metadata?.cuisine_type?.value

  return (
    <Link href={`/restaurants/${restaurant.slug}`}>
      <div className="restaurant-card">
        <div className="relative h-48">
          {featuredImage ? (
            <img
              src={`${featuredImage.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
              alt={restaurant.metadata?.name || restaurant.title}
              className="w-full h-full object-cover"
              width="300"
              height="200"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {cuisineType && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                {cuisineType}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {restaurant.metadata?.name || restaurant.title}
            </h3>
            {rating > 0 && (
              <div className="flex items-center space-x-1 text-sm">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-gray-700">{rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {restaurant.metadata?.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-700">
            {deliveryTime && (
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{deliveryTime}</span>
              </span>
            )}
            
            {deliveryFee !== undefined && (
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>${deliveryFee.toFixed(2)} delivery</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}