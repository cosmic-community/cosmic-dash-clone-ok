// app/restaurants/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getRestaurant, getMenuItemsByRestaurant } from '@/lib/cosmic'
import { MenuItem } from '@/types'
import RestaurantHeader from '@/components/RestaurantHeader'
import MenuSection from '@/components/MenuSection'

interface RestaurantPageProps {
  params: Promise<{ slug: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)

  if (!restaurant) {
    notFound()
  }

  const menuItems = await getMenuItemsByRestaurant(restaurant.id)

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    const category = item.metadata?.category?.value || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  // Define category order for consistent display
  const categoryOrder = ['Appetizers', 'Entrees', 'Desserts', 'Beverages', 'Other']

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu</h1>
            <p className="text-gray-600">
              Choose from our selection of delicious items
            </p>
          </div>

          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items available</h3>
              <p className="text-gray-600">Please check back later for menu updates.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categoryOrder
                .filter(categoryKey => {
                  const items = menuByCategory[categoryKey]
                  return items && items.length > 0
                })
                .map((categoryKey) => {
                  const items = menuByCategory[categoryKey]
                  
                  // Safety check - ensure items exist before rendering
                  if (!items || items.length === 0) {
                    return null
                  }
                  
                  return (
                    <MenuSection
                      key={categoryKey}
                      title={categoryKey}
                      items={items}
                    />
                  )
                })}
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