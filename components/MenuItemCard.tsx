'use client'

import { useState } from 'react'
import { MenuItem } from '@/types'
import { addToCart } from '@/lib/cart'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart?: () => void
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showAddedAnimation, setShowAddedAnimation] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      addToCart(item, quantity)
      
      // Trigger cart count update immediately
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      
      // Show animation
      setShowAddedAnimation(true)
      setTimeout(() => setShowAddedAnimation(false), 1000)
      
      onAddToCart?.()
      // Reset quantity after adding
      setQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const price = item.metadata?.price || 0
  const isAvailable = item.metadata?.available !== false

  return (
    <div className="card h-full">
      <div className="relative">
        {item.metadata?.food_image && (
          <img
            src={`${item.metadata.food_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
            width="300"
            height="200"
          />
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-t-lg">
            <span className="text-white font-semibold">Not Available</span>
          </div>
        )}
        
        {/* Added to cart animation */}
        {showAddedAnimation && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-t-lg animate-pulse">
            <div className="text-white font-semibold text-lg flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to Cart!</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
        {item.metadata?.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.metadata.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
          {item.metadata?.category && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {item.metadata.category.value}
            </span>
          )}
        </div>
        
        {isAvailable && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full btn-primary transition-all duration-200 ${
                isAdding ? 'scale-95 opacity-80' : 'hover:scale-105'
              }`}
            >
              {isAdding ? 'Adding...' : `Add to Cart • $${(price * quantity).toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}