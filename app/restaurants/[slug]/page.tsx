// app/restaurants/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getRestaurant, getMenuItemsByRestaurant } from '@/lib/cosmic'
import RestaurantHeader from '@/components/RestaurantHeader'
import MenuSection from '@/components/MenuSection'
import { MenuItem } from '@/types'

interface RestaurantPageProps {
  params: Promise<{ slug: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)

  if (!restaurant) {
    notFound()
  }

  // Get menu items for this restaurant
  const menuItems = await getMenuItemsByRestaurant(restaurant.id)

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc: Record<string, MenuItem[]>, item) => {
    const category = item.metadata?.category?.value || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  // Define the order of categories for consistent display
  const categoryOrder = ['Appetizers', 'Entrees', 'Desserts', 'Beverages', 'Other']

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4 4h.01m0 0h.01m0 0h.01m0 0h.01M12 12h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Coming Soon</h3>
              <p className="text-gray-600">This restaurant is updating their menu. Please check back later.</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Menu</h2>
                
                {categoryOrder
                  .filter(category => {
                    const items = groupedItems[category]
                    return items && items.length > 0
                  })
                  .map((category) => {
                    const items = groupedItems[category]
                    
                    if (!items || items.length === 0) {
                      return null
                    }
                    
                    return (
                      <MenuSection
                        key={category}
                        title={category}
                        items={items}
                      />
                    )
                  })}
              </div>
            </div>
          )}
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
    title: `${restaurant.title} - Menu & Delivery`,
    description: restaurant.metadata?.description || `Order from ${restaurant.title}`,
  }
}