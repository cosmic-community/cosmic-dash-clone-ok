'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import CuisineFilter from '@/components/CuisineFilter'
import RestaurantGrid from '@/components/RestaurantGrid'
import Footer from '@/components/Footer'
import { getRestaurants, getRestaurantsByCuisine } from '@/lib/cosmic'
import { Restaurant } from '@/types'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Fetch all restaurants on initial load
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true)
        const data = await getRestaurants()
        setRestaurants(data)
        setFilteredRestaurants(data)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Handle cuisine filter changes
  const handleCuisineFilter = async (cuisine: string) => {
    try {
      setLoading(true)
      setSelectedCuisine(cuisine)
      
      if (cuisine === 'all') {
        setFilteredRestaurants(restaurants)
      } else {
        const filtered = await getRestaurantsByCuisine(cuisine)
        setFilteredRestaurants(filtered)
      }
    } catch (error) {
      console.error('Error filtering restaurants:', error)
      // Fall back to client-side filtering if API fails
      if (cuisine === 'all') {
        setFilteredRestaurants(restaurants)
      } else {
        const filtered = restaurants.filter(
          restaurant => restaurant.metadata?.cuisine_type?.value === cuisine
        )
        setFilteredRestaurants(filtered)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Find Your Favorite Food
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Discover amazing restaurants and order your favorite meals
          </p>
          
          <CuisineFilter
            selectedCuisine={selectedCuisine}
            onCuisineChange={handleCuisineFilter}
          />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <RestaurantGrid restaurants={filteredRestaurants} />
        )}
      </main>
      
      <Footer />
    </div>
  )
}