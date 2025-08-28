'use client'

import { useState, useEffect } from 'react'
import { Cart, CartItem } from '@/types'
import { getCart, updateItemQuantity, removeFromCart, clearCart } from '@/lib/cart'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCart(getCart())
    setIsLoading(false)
  }, [])

  const updateQuantity = (cartItemId: string, quantity: number) => {
    const updatedCart = updateItemQuantity(cartItemId, quantity)
    setCart(updatedCart)
    // Dispatch custom event to update cart button
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (cartItemId: string) => {
    const updatedCart = removeFromCart(cartItemId)
    setCart(updatedCart)
    // Dispatch custom event to update cart button
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleClearCart = () => {
    const updatedCart = clearCart()
    setCart(updatedCart)
    // Dispatch custom event to update cart button
    window.dispatchEvent(new Event('cartUpdated'))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some delicious items to your cart to get started.</p>
          <Link href="/" className="btn-primary inline-block">
            Browse Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        {cart.restaurant && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-1">Order from</h2>
            <div className="flex items-center space-x-3">
              {cart.restaurant.metadata?.featured_image && (
                <img
                  src={`${cart.restaurant.metadata.featured_image.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                  alt={cart.restaurant.title}
                  className="w-12 h-12 object-cover rounded-lg"
                  width="48"
                  height="48"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{cart.restaurant.title}</p>
                <p className="text-sm text-gray-600">
                  Delivery: {cart.restaurant.metadata?.delivery_time}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {cart.items.map((item: CartItem) => (
            <div key={item.id} className="card">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {item.menuItem.metadata?.food_image && (
                    <img
                      src={`${item.menuItem.metadata.food_image.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                      alt={item.menuItem.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      width="80"
                      height="80"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.menuItem.title}
                    </h3>
                    {item.menuItem.metadata?.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.menuItem.metadata.description}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-gray-500 text-sm mb-2">
                        <span className="font-medium">Notes:</span> {item.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="font-medium text-lg min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-lg">
                          ${((item.menuItem.metadata?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">${cart.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link href="/checkout" className="btn-primary w-full block text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}