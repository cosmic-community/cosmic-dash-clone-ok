'use client'

import { useState } from 'react'

const cuisines = [
  { key: 'all', label: 'All Cuisines' },
  { key: 'italian', label: 'Italian' },
  { key: 'mexican', label: 'Mexican' },
  { key: 'asian', label: 'Asian' },
  { key: 'american', label: 'American' },
  { key: 'indian', label: 'Indian' },
]

export default function CuisineFilter() {
  const [selectedCuisine, setSelectedCuisine] = useState('all')

  return (
    <div className="flex flex-wrap gap-2">
      {cuisines.map(cuisine => (
        <button
          key={cuisine.key}
          onClick={() => setSelectedCuisine(cuisine.key)}
          className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
            selectedCuisine === cuisine.key
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          {cuisine.label}
        </button>
      ))}
    </div>
  )
}