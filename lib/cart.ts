import { MenuItem, Restaurant, Cart, CartItem } from '@/types'

// Cart storage key
const CART_STORAGE_KEY = 'doordash-cart'

// Initialize empty cart
function createEmptyCart(): Cart {
  return {
    items: [],
    restaurant: undefined,
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  }
}

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return createEmptyCart()
  }

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    if (!cartData) {
      return createEmptyCart()
    }

    const cart = JSON.parse(cartData) as Cart
    
    // Validate cart structure and provide defaults for potentially undefined values
    return {
      items: Array.isArray(cart.items) ? cart.items : [],
      restaurant: cart.restaurant || undefined,
      subtotal: typeof cart.subtotal === 'number' ? cart.subtotal : 0,
      deliveryFee: typeof cart.deliveryFee === 'number' ? cart.deliveryFee : 0,
      total: typeof cart.total === 'number' ? cart.total : 0
    }
  } catch (error) {
    console.error('Error parsing cart data:', error)
    return createEmptyCart()
  }
}

// Save cart to localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

// Calculate cart totals
export function calculateCartTotals(items: CartItem[], restaurant?: Restaurant): { subtotal: number; deliveryFee: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    const price = item.menuItem?.metadata?.price || 0
    return sum + (price * item.quantity)
  }, 0)
  
  const deliveryFee = restaurant?.metadata?.delivery_fee || 0
  const total = subtotal + deliveryFee
  
  return { subtotal, deliveryFee, total }
}

// Add item to cart
export function addToCart(menuItem: MenuItem, quantity: number = 1, notes?: string): Cart {
  const currentCart = getCart()
  
  // Check if we're adding from a different restaurant
  const itemRestaurant = menuItem.metadata?.restaurant
  const currentRestaurant = currentCart.restaurant
  
  if (currentRestaurant && itemRestaurant && typeof itemRestaurant === 'object') {
    if (currentRestaurant.id !== itemRestaurant.id) {
      // Different restaurant - clear cart and start fresh
      const newCart = createEmptyCart()
      newCart.restaurant = itemRestaurant
      newCart.items = [{
        id: menuItem.id,
        menuItem,
        quantity,
        notes
      }]
      
      const totals = calculateCartTotals(newCart.items, newCart.restaurant)
      newCart.subtotal = totals.subtotal
      newCart.deliveryFee = totals.deliveryFee
      newCart.total = totals.total
      
      saveCart(newCart)
      return newCart
    }
  }
  
  // Same restaurant or first item - find existing item or add new one
  const existingItemIndex = currentCart.items.findIndex(item => item.id === menuItem.id)
  
  if (existingItemIndex >= 0) {
    // Update existing item with null safety check
    const existingItem = currentCart.items[existingItemIndex]
    if (existingItem) {
      existingItem.quantity += quantity
      if (notes) {
        existingItem.notes = notes
      }
    }
  } else {
    // Add new item
    currentCart.items.push({
      id: menuItem.id,
      menuItem,
      quantity,
      notes
    })
    
    // Set restaurant if not already set
    if (!currentCart.restaurant && itemRestaurant && typeof itemRestaurant === 'object') {
      currentCart.restaurant = itemRestaurant
    }
  }
  
  // Recalculate totals
  const totals = calculateCartTotals(currentCart.items, currentCart.restaurant)
  currentCart.subtotal = totals.subtotal
  currentCart.deliveryFee = totals.deliveryFee
  currentCart.total = totals.total
  
  saveCart(currentCart)
  return currentCart
}

// Remove item from cart
export function removeFromCart(itemId: string): Cart {
  const currentCart = getCart()
  
  // Filter out the item with null safety
  currentCart.items = currentCart.items.filter(item => item && item.id !== itemId)
  
  // If cart is empty, reset restaurant
  if (currentCart.items.length === 0) {
    currentCart.restaurant = undefined
  }
  
  // Recalculate totals
  const totals = calculateCartTotals(currentCart.items, currentCart.restaurant)
  currentCart.subtotal = totals.subtotal
  currentCart.deliveryFee = totals.deliveryFee
  currentCart.total = totals.total
  
  saveCart(currentCart)
  return currentCart
}

// Update item quantity
export function updateItemQuantity(itemId: string, quantity: number): Cart {
  const currentCart = getCart()
  
  if (quantity <= 0) {
    return removeFromCart(itemId)
  }
  
  // Find and update item with null safety
  const itemIndex = currentCart.items.findIndex(item => item && item.id === itemId)
  if (itemIndex >= 0) {
    const item = currentCart.items[itemIndex]
    if (item) {
      item.quantity = quantity
    }
  }
  
  // Recalculate totals
  const totals = calculateCartTotals(currentCart.items, currentCart.restaurant)
  currentCart.subtotal = totals.subtotal
  currentCart.deliveryFee = totals.deliveryFee
  currentCart.total = totals.total
  
  saveCart(currentCart)
  return currentCart
}

// Clear entire cart
export function clearCart(): Cart {
  const emptyCart = createEmptyCart()
  saveCart(emptyCart)
  return emptyCart
}

// Get cart item count
export function getCartItemCount(cart?: Cart): number {
  const currentCart = cart || getCart()
  return currentCart.items.reduce((count, item) => {
    // Add null safety check for item
    return count + (item?.quantity || 0)
  }, 0)
}

// Get cart total
export function getCartTotal(cart?: Cart): number {
  const currentCart = cart || getCart()
  return currentCart.total
}

// Check if item is in cart
export function isItemInCart(itemId: string, cart?: Cart): boolean {
  const currentCart = cart || getCart()
  return currentCart.items.some(item => item && item.id === itemId)
}

// Get item quantity in cart
export function getItemQuantityInCart(itemId: string, cart?: Cart): number {
  const currentCart = cart || getCart()
  const item = currentCart.items.find(item => item && item.id === itemId)
  return item?.quantity || 0
}