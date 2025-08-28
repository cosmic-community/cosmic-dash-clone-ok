import { getRestaurants } from '@/lib/cosmic'
import Hero from '@/components/Hero'
import CuisineFilter from '@/components/CuisineFilter'
import RestaurantGrid from '@/components/RestaurantGrid'

interface HomePageProps {
  searchParams: Promise<{ cuisine?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const selectedCuisine = params.cuisine
  
  // Fetch all restaurants
  const allRestaurants = await getRestaurants()
  
  // Filter restaurants by cuisine if a cuisine is selected
  const restaurants = selectedCuisine 
    ? allRestaurants.filter(restaurant => 
        restaurant.metadata?.cuisine_type?.value?.toLowerCase() === selectedCuisine.toLowerCase()
      )
    : allRestaurants

  return (
    <div>
      <Hero />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Restaurants
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing food from the best restaurants in your area
            </p>
          </div>
          
          <CuisineFilter 
            restaurants={allRestaurants}
            selectedCuisine={selectedCuisine || null}
          />
          
          <RestaurantGrid restaurants={restaurants} />
        </div>
      </section>
    </div>
  )
}