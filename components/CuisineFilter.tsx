'use client'

import { useState, useEffect } from 'react'
import { Restaurant, CuisineType } from '@/types'

interface CuisineFilterProps {
  restaurants: Restaurant[]
  onFilterChange: (filteredRestaurants: Restaurant[]) => void
}

const cuisineTypes: CuisineType[] = ['Italian', 'Mexican', 'Asian', 'American', 'Indian']

export default function CuisineFilter({ restaurants, onFilterChange }: CuisineFilterProps) {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | 'All'>('All')

  useEffect(() => {
    if (selectedCuisine === 'All') {
      onFilterChange(restaurants)
    } else {
      const filtered = restaurants.filter(restaurant => {
        const cuisineValue = restaurant.metadata?.cuisine_type?.value
        return cuisineValue === selectedCuisine
      })
      onFilterChange(filtered)
    }
  }, [selectedCuisine, restaurants, onFilterChange])

  // Get available cuisine types from restaurants
  const availableCuisines = Array.from(
    new Set(
      restaurants
        .map(r => r.metadata?.cuisine_type?.value)
        .filter(Boolean)
    )
  ).sort()

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Cuisine</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCuisine('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCuisine === 'All'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({restaurants.length})
        </button>
        
        {availableCuisines.map(cuisine => {
          const count = restaurants.filter(r => 
            r.metadata?.cuisine_type?.value === cuisine
          ).length
          
          return (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine as CuisineType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCuisine === cuisine
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cuisine} ({count})
            </button>
          )
        })}
      </div>
      
      {selectedCuisine !== 'All' && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {restaurants.filter(r => 
            r.metadata?.cuisine_type?.value === selectedCuisine
          ).length} {selectedCuisine} restaurant{restaurants.filter(r => 
            r.metadata?.cuisine_type?.value === selectedCuisine
          ).length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}