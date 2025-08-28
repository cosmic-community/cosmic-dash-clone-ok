import { getRestaurants } from '@/lib/cosmic'
import Hero from '@/components/Hero'
import RestaurantGrid from '@/components/RestaurantGrid'
import CuisineFilter from '@/components/CuisineFilter'

export default async function HomePage() {
  const restaurants = await getRestaurants()

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose from Our Restaurants
          </h2>
          <CuisineFilter />
        </div>
        <RestaurantGrid restaurants={restaurants} />
      </div>
    </div>
  )
}