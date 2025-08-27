import { Order } from '@/types'

interface OrderDetailsProps {
  order: Order
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const restaurant = order.metadata?.restaurant
  const items = order.metadata?.items_ordered || []
  const total = order.metadata?.total_amount || 0
  const deliveryAddress = order.metadata?.delivery_address

  return (
    <div className="card">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
        
        {restaurant && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Restaurant</h3>
            <div className="flex items-center space-x-3">
              {restaurant.metadata?.featured_image && (
                <img
                  src={`${restaurant.metadata.featured_image.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                  alt={restaurant.title}
                  className="w-12 h-12 object-cover rounded-lg"
                  width="48"
                  height="48"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{restaurant.title}</p>
                {restaurant.metadata?.address && (
                  <p className="text-sm text-gray-600">{restaurant.metadata.address}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  {item.metadata?.food_image && (
                    <img
                      src={`${item.metadata.food_image.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-lg"
                      width="40"
                      height="40"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.metadata?.description && (
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {item.metadata.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  ${(item.metadata?.price || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        {deliveryAddress && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
            <p className="text-gray-600 whitespace-pre-line">{deliveryAddress}</p>
          </div>
        )}
      </div>
    </div>
  )
}