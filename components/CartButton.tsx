'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
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
      <button className="p-2 text-gray-700 hover:text-primary transition-colors relative">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] text-[10px] font-semibold">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>
    </Link>
  )
}