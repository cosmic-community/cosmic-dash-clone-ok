import { CartItem, Cart, MenuItem, Restaurant } from '@/types'

const CART_STORAGE_KEY = 'doordash-cart'

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return {
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      total: 0
    }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) {
      return {
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0
      }
    }

    const cart: Cart = JSON.parse(stored)
    return recalculateCart(cart)
  } catch (error) {
    console.error('Error loading cart:', error)
    return {
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      total: 0
    }
  }
}

// Save cart to localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

// Add item to cart
export function addToCart(menuItem: MenuItem, quantity: number = 1, notes?: string): Cart {
  const currentCart = getCart()
  
  // Check if adding from different restaurant
  if (currentCart.restaurant && currentCart.restaurant.id !== getRestaurantFromMenuItem(menuItem)?.id) {
    // Clear cart if switching restaurants
    const newCart: Cart = {
      items: [{
        id: generateCartItemId(),
        menuItem,
        quantity,
        notes
      }],
      restaurant: getRestaurantFromMenuItem(menuItem),
      subtotal: 0,
      deliveryFee: 0,
      total: 0
    }
    const calculatedCart = recalculateCart(newCart)
    saveCart(calculatedCart)
    return calculatedCart
  }

  // Check if item already exists in cart
  const existingItemIndex = currentCart.items.findIndex(item => item.menuItem.id === menuItem.id)
  
  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    currentCart.items[existingItemIndex].quantity += quantity
    if (notes) {
      currentCart.items[existingItemIndex].notes = notes
    }
  } else {
    // Add new item to cart
    currentCart.items.push({
      id: generateCartItemId(),
      menuItem,
      quantity,
      notes
    })
  }

  // Set restaurant if not set
  if (!currentCart.restaurant) {
    currentCart.restaurant = getRestaurantFromMenuItem(menuItem)
  }

  const calculatedCart = recalculateCart(currentCart)
  saveCart(calculatedCart)
  return calculatedCart
}

// Remove item from cart
export function removeFromCart(cartItemId: string): Cart {
  const currentCart = getCart()
  currentCart.items = currentCart.items.filter(item => item.id !== cartItemId)
  
  // Clear restaurant if no items left
  if (currentCart.items.length === 0) {
    currentCart.restaurant = undefined
  }

  const calculatedCart = recalculateCart(currentCart)
  saveCart(calculatedCart)
  return calculatedCart
}

// Update item quantity in cart
export function updateCartItemQuantity(cartItemId: string, quantity: number): Cart {
  const currentCart = getCart()
  const itemIndex = currentCart.items.findIndex(item => item.id === cartItemId)
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return removeFromCart(cartItemId)
    } else {
      currentCart.items[itemIndex].quantity = quantity
    }
  }

  const calculatedCart = recalculateCart(currentCart)
  saveCart(calculatedCart)
  return calculatedCart
}

// Clear entire cart
export function clearCart(): Cart {
  const emptyCart: Cart = {
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  }
  saveCart(emptyCart)
  return emptyCart
}

// Recalculate cart totals
function recalculateCart(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.menuItem.metadata?.price || 0) * item.quantity
  }, 0)

  const deliveryFee = cart.restaurant?.metadata?.delivery_fee || 0
  const total = subtotal + deliveryFee

  return {
    ...cart,
    subtotal,
    deliveryFee,
    total
  }
}

// Get restaurant from menu item
function getRestaurantFromMenuItem(menuItem: MenuItem): Restaurant | undefined {
  if (typeof menuItem.metadata?.restaurant === 'object' && menuItem.metadata.restaurant.id) {
    return menuItem.metadata.restaurant as Restaurant
  }
  return undefined
}

// Generate unique cart item ID
function generateCartItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get cart item count
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}