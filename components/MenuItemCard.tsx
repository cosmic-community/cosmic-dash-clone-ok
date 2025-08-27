import { MenuItem } from '@/types'

interface MenuItemCardProps {
  item: MenuItem
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const foodImage = item.metadata?.food_image
  const price = item.metadata?.price || 0
  const available = item.metadata?.available !== false

  return (
    <div className={`menu-item-card ${!available ? 'opacity-50' : ''}`}>
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {item.metadata?.name || item.title}
            </h3>
            
            {item.metadata?.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.metadata.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${price.toFixed(2)}
              </span>
              
              {available ? (
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Add to Cart
                </button>
              ) : (
                <span className="text-gray-500 text-sm">Currently Unavailable</span>
              )}
            </div>
          </div>
        </div>
        
        {foodImage && (
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <img
              src={`${foodImage.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
              alt={item.metadata?.name || item.title}
              className="w-full h-full object-cover rounded-lg"
              width="100"
              height="100"
            />
          </div>
        )}
      </div>
    </div>
  )
}