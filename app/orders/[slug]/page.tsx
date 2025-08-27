// app/orders/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getOrder } from '@/lib/cosmic'
import OrderDetails from '@/components/OrderDetails'
import OrderTracking from '@/components/OrderTracking'

interface OrderPageProps {
  params: Promise<{ slug: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { slug } = await params
  const order = await getOrder(slug)

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {order.metadata?.order_number}
          </h1>
          <p className="text-gray-600">
            Order placed on {new Date(order.metadata?.order_date || '').toLocaleDateString()}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OrderTracking order={order} />
          <OrderDetails order={order} />
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: OrderPageProps) {
  const { slug } = await params
  const order = await getOrder(slug)
  
  if (!order) {
    return {
      title: 'Order Not Found'
    }
  }

  return {
    title: `${order.metadata?.order_number} - Order Details`,
    description: `Track your order from ${order.metadata?.restaurant?.title}`,
  }
}