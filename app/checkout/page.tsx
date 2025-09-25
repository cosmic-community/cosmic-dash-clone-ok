'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cart } from '@/types'
import { getCart, clearCart } from '@/lib/cart'
// Note: Do not import server-side Cosmic client here; call server API instead

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: ''
  })

  useEffect(() => {
    const currentCart = getCart()
    setCart(currentCart)
    setIsLoading(false)

    // Redirect if cart is empty
    if (currentCart.items.length === 0) {
      router.push('/cart')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderNumber = `#${Date.now().toString().slice(-6)}`
      const restaurantId = cart.restaurant?.id
      const itemIds = cart.items.map(item => item.menuItem.id)

      if (!restaurantId) {
        throw new Error('Restaurant information is missing')
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          delivery_address: formData.delivery_address,
          restaurant: restaurantId,
          items_ordered: itemIds,
          total_amount: cart.total,
          status: 'Order Placed'
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create order')
      }

      // Clear the cart
      clearCart()
      
      // Dispatch custom event to update cart button
      window.dispatchEvent(new Event('cartUpdated'))

      // Redirect to orders page
      router.push('/orders')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('There was an error placing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="max-w-2xl mx-auto">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {cart.restaurant && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{cart.restaurant.title}</p>
                  <p className="text-sm text-gray-600">
                    {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} • ${cart.total.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${cart.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="delivery_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    id="delivery_address"
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full address including apartment number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-lg"
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • $${cart.total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  )
}