'use client'

import { useState, useEffect } from 'react'
import { getCartItemCount } from '@/lib/cart'
import Link from 'next/link'

export default function CartButton() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    // Update cart count on mount
    setItemCount(getCartItemCount())

    // Listen for storage changes (cart updates)
    const handleStorageChange = () => {
      setItemCount(getCartItemCount())
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

  return (
    <Link href="/cart" className="relative">
      <button className="btn-primary relative">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>
    </Link>
  )
}