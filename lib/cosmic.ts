import { createBucketClient } from '@cosmicjs/sdk'
import type { BucketConfig } from '@cosmicjs/sdk'
import { Restaurant, MenuItem, Order } from '@/types'

const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string | undefined
const readKey = process.env.COSMIC_READ_KEY as string | undefined
const writeKey = process.env.COSMIC_WRITE_KEY as string | undefined

const baseConfig: Partial<BucketConfig> = {
  bucketSlug: bucketSlug || ''
}
if (readKey) baseConfig.readKey = readKey
if (writeKey) baseConfig.writeKey = writeKey

export const cosmic = createBucketClient(baseConfig as BucketConfig)

// Map display values to select-dropdown keys configured in Cosmic
const ORDER_STATUS_KEY_BY_VALUE: Record<string, string> = {
  'Order Placed': 'placed',
  'Confirmed': 'confirmed',
  'Preparing': 'preparing',
  'Ready for Pickup': 'ready-for-pickup',
  'Out for Delivery': 'out-for-delivery',
  'Delivered': 'delivered'
}

function getOrderStatusMetadata(statusDisplayValue: string): { key: string; value: string } {
  const key = ORDER_STATUS_KEY_BY_VALUE[statusDisplayValue]
  if (!key) {
    throw new Error(`Unknown order status '${statusDisplayValue}'. Expected one of: ${Object.keys(ORDER_STATUS_KEY_BY_VALUE).join(', ')}`)
  }
  return { key, value: statusDisplayValue }
}

// Helper for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all restaurants
export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Restaurant[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch restaurants')
  }
}

// Get restaurants by cuisine type
export async function getRestaurantsByCuisine(cuisineType: string): Promise<Restaurant[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'restaurants',
        'metadata.cuisine_type.value': cuisineType 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Restaurant[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch restaurants by cuisine')
  }
}

// Get single restaurant by slug
export async function getRestaurant(slug: string): Promise<Restaurant | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'restaurants',
        slug
      })
      .depth(1)
    
    return response.object as Restaurant
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch restaurant')
  }
}

// Get all menu items
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'menu-items' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as MenuItem[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch menu items')
  }
}

// Get menu items by restaurant
export async function getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.restaurant': restaurantId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as MenuItem[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch menu items')
  }
}

// Get menu items by category
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.category.value': category 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as MenuItem[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch menu items by category')
  }
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'orders' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    // Manual sorting by order date (newest first)
    return (response.objects as Order[]).sort((a, b) => {
      const dateA = new Date(a.metadata?.order_date || '').getTime()
      const dateB = new Date(b.metadata?.order_date || '').getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch orders')
  }
}

// Get single order by slug
export async function getOrder(slug: string): Promise<Order | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'orders',
        slug
      })
      .depth(1)
    
    return response.object as Order
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch order')
  }
}

// Create new order
export async function createOrder(orderData: {
  order_number: string;
  customer_name: string;
  customer_phone?: string;
  delivery_address: string;
  restaurant: string;
  items_ordered: string[];
  total_amount: number;
  status: string;
  order_date?: string;
}): Promise<Order> {
  try {
    if (!writeKey) {
      throw new Error('COSMIC_WRITE_KEY is missing. Set it in your environment variables.')
    }

    const response = await cosmic.objects.insertOne({
      type: 'orders',
      title: `Order ${orderData.order_number}`,
      metadata: {
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone || '',
        delivery_address: orderData.delivery_address,
        restaurant: orderData.restaurant,
        items_ordered: orderData.items_ordered,
        total_amount: orderData.total_amount,
        status: getOrderStatusMetadata(orderData.status),
        order_date: orderData.order_date || new Date().toISOString().split('T')[0]
      }
    })
    
    return response.object as Order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  try {
    if (!writeKey) {
      throw new Error('COSMIC_WRITE_KEY is missing. Set it in your environment variables.')
    }

    const response = await cosmic.objects.updateOne(orderId, {
      metadata: {
        status: getOrderStatusMetadata(status)
      }
    })
    
    return response.object as Order
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}