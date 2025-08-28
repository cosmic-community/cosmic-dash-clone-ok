'use client'

interface CuisineFilterProps {
  selectedCuisine: string
  onCuisineChange: (cuisine: string) => void
}

const cuisineTypes = [
  { key: 'all', label: 'All Cuisines', emoji: '🍽️' },
  { key: 'Italian', label: 'Italian', emoji: '🍝' },
  { key: 'Mexican', label: 'Mexican', emoji: '🌮' },
  { key: 'Asian', label: 'Asian', emoji: '🍜' },
  { key: 'American', label: 'American', emoji: '🍔' },
  { key: 'Indian', label: 'Indian', emoji: '🍛' },
]

export default function CuisineFilter({ selectedCuisine, onCuisineChange }: CuisineFilterProps) {
  const handleFilterClick = (cuisine: string) => {
    // Prevent any default behavior and ensure smooth filtering
    onCuisineChange(cuisine)
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {cuisineTypes.map((cuisine) => (
        <button
          key={cuisine.key}
          type="button"
          onClick={() => handleFilterClick(cuisine.key)}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCuisine === cuisine.key
              ? 'bg-primary text-white shadow-md transform scale-105'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary hover:shadow-md'
          }`}
          aria-pressed={selectedCuisine === cuisine.key}
          aria-label={`Filter by ${cuisine.label} cuisine`}
        >
          <span className="mr-2" role="img" aria-label={cuisine.label}>
            {cuisine.emoji}
          </span>
          {cuisine.label}
        </button>
      ))}
    </div>
  )
}