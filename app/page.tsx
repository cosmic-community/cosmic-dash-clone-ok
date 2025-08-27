import { getRestaurants } from '@/lib/cosmic'
import Hero from '@/components/Hero'
import RestaurantGrid from '@/components/RestaurantGrid'

export default async function HomePage() {
  const restaurants = await getRestaurants()

  return (
    <div>
      <Hero />
      <RestaurantGrid restaurants={restaurants} />
    </div>
  )
}