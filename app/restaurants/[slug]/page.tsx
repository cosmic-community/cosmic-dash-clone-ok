// app/restaurants/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getRestaurant, getMenuItemsByRestaurant } from '@/lib/cosmic'
import RestaurantHeader from '@/components/RestaurantHeader'
import MenuSection from '@/components/MenuSection'

interface RestaurantPageProps {
  params: Promise<{ slug: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params
  
  const [restaurant, menuItems] = await Promise.all([
    getRestaurant(slug),
    getMenuItemsByRestaurant(slug)
  ])

  if (!restaurant) {
    notFound()
  }

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    const category = item.metadata?.category?.value || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  return (
    <div className="space-y-8">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {Object.entries(menuByCategory).map(([category, items]) => (
            <MenuSection 
              key={category} 
              category={category} 
              items={items} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RestaurantPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)
  
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found'
    }
  }

  return {
    title: `${restaurant.metadata?.name} - Food Delivery`,
    description: restaurant.metadata?.description,
  }
}