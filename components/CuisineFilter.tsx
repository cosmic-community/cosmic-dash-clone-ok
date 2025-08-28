'use client'
import { useState } from 'react'
import { CuisineType } from '@/types'

interface CuisineFilterProps {
  onFilterChange?: (cuisine: string | null) => void
}

const cuisineTypes: { key: string; value: CuisineType }[] = [
  { key: 'all', value: 'All' as CuisineType },
  { key: 'american', value: 'American' },
  { key: 'italian', value: 'Italian' },
  { key: 'mexican', value: 'Mexican' },
  { key: 'asian', value: 'Asian' },
  { key: 'indian', value: 'Indian' },
]

export default function CuisineFilter({ onFilterChange }: CuisineFilterProps) {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all')

  const handleFilterChange = (cuisineKey: string) => {
    setSelectedCuisine(cuisineKey)
    const filterValue = cuisineKey === 'all' ? null : cuisineTypes.find(c => c.key === cuisineKey)?.value || null
    onFilterChange?.(filterValue)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {cuisineTypes.map((cuisine) => (
        <button
          key={cuisine.key}
          onClick={() => handleFilterChange(cuisine.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedCuisine === cuisine.key
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {cuisine.value}
        </button>
      ))}
    </div>
  )
}