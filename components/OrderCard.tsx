import Link from 'next/link'
import { Order } from '@/types'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const restaurant = order.metadata?.restaurant
  const status = order.metadata?.status?.value || 'Unknown'
  const total = order.metadata?.total_amount || 0
  const orderDate = order.metadata?.order_date
  const itemsCount = order.metadata?.items_ordered?.length || 0

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed':
        return 'status-placed'
      case 'confirmed':
        return 'status-confirmed'
      case 'preparing':
        return 'status-preparing'
      case 'ready for pickup':
        return 'status-ready'
      case 'out for delivery':
        return 'status-delivery'
      case 'delivered':
        return 'status-delivered'
      default:
        return 'status-badge bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link href={`/orders/${order.slug}`}>
      <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {order.metadata?.order_number}
              </h3>
              {restaurant && (
                <p className="text-gray-600">
                  {restaurant.title}
                </p>
              )}
            </div>
            
            <span className={getStatusClass(status)}>
              {status}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>{itemsCount} item{itemsCount !== 1 ? 's' : ''}</span>
            <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
          </div>
          
          {orderDate && (
            <div className="text-xs text-gray-500">
              Ordered on {new Date(orderDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}