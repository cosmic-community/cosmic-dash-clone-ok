import { Restaurant } from '@/types'

interface RestaurantHeaderProps {
  restaurant: Restaurant
}

export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const featuredImage = restaurant.metadata?.featured_image
  const rating = restaurant.metadata?.rating || 0
  const deliveryTime = restaurant.metadata?.delivery_time
  const deliveryFee = restaurant.metadata?.delivery_fee
  const address = restaurant.metadata?.address
  const cuisineType = restaurant.metadata?.cuisine_type?.value

  return (
    <div className="relative">
      <div className="h-64 md:h-80 relative">
        {featuredImage ? (
          <img
            src={`${featuredImage.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
            alt={restaurant.metadata?.name || restaurant.title}
            className="w-full h-full object-cover"
            width="600"
            height="300"
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 -mt-16 relative z-10 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {restaurant.metadata?.name || restaurant.title}
              </h1>
              
              {restaurant.metadata?.description && (
                <p className="text-gray-600 mb-3">
                  {restaurant.metadata.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                {cuisineType && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {cuisineType}
                  </span>
                )}
                
                {rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{rating}</span>
                  </div>
                )}
                
                {address && (
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{address}</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Info</h3>
              
              <div className="space-y-2 text-sm">
                {deliveryTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery time:</span>
                    <span className="font-medium">{deliveryTime}</span>
                  </div>
                )}
                
                {deliveryFee !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery fee:</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}