import { Order } from '@/types'

interface OrderTrackingProps {
  order: Order
}

const orderSteps = [
  { key: 'placed', label: 'Order Placed', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready for Pickup', icon: '📦' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
]

export default function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatus = order.metadata?.status?.key || 'placed'
  const currentStepIndex = orderSteps.findIndex(step => step.key === currentStatus)

  return (
    <div className="card">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
        
        <div className="space-y-4">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex
            
            return (
              <div key={step.key} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                  isCompleted 
                    ? isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted && !isCurrent ? '✓' : step.icon}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-primary">Current status</p>
                  )}
                </div>
                
                {index < orderSteps.length - 1 && (
                  <div className={`w-px h-8 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Estimated Delivery</h3>
          <p className="text-gray-600">
            Your order will arrive in approximately{' '}
            <span className="font-semibold">
              {order.metadata?.restaurant?.metadata?.delivery_time || '30-45 min'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}