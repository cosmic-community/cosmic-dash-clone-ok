'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Restaurant } from '@/types'

interface CuisineFilterProps {
  restaurants: Restaurant[]
  selectedCuisine: string | null
}

export default function CuisineFilter({ restaurants, selectedCuisine }: CuisineFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get unique cuisine types from restaurants
  const cuisineTypes = Array.from(
    new Set(
      restaurants
        .map(restaurant => restaurant.metadata?.cuisine_type?.value)
        .filter(Boolean)
    )
  ).sort()

  const handleCuisineChange = (cuisine: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (cuisine) {
      params.set('cuisine', cuisine.toLowerCase())
    } else {
      params.delete('cuisine')
    }
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleCuisineChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCuisine
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Cuisines
        </button>
        
        {cuisineTypes.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => handleCuisineChange(cuisine)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCuisine?.toLowerCase() === cuisine?.toLowerCase()
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>
      
      {selectedCuisine && (
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Showing {cuisineTypes.includes(selectedCuisine) ? 
              restaurants.filter(r => r.metadata?.cuisine_type?.value?.toLowerCase() === selectedCuisine.toLowerCase()).length 
              : 0
            } {selectedCuisine} restaurants
          </p>
        </div>
      )}
    </div>
  )
}