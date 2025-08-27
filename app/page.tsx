import { getRestaurants } from '@/lib/cosmic'
import RestaurantGrid from '@/components/RestaurantGrid'
import Hero from '@/components/Hero'
import CuisineFilter from '@/components/CuisineFilter'

export default async function HomePage() {
  const restaurants = await getRestaurants()

  return (
    <div className="space-y-8">
      <Hero />
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Restaurants
          </h2>
          <CuisineFilter />
        </div>
        
        <RestaurantGrid restaurants={restaurants} />
      </div>
    </div>
  )
}