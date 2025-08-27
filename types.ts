// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Restaurant interface
export interface Restaurant extends CosmicObject {
  type: 'restaurants';
  metadata: {
    name?: string;
    description?: string;
    cuisine_type?: {
      key: string;
      value: CuisineType;
    };
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    rating?: number;
    delivery_time?: string;
    delivery_fee?: number;
    address?: string;
  };
}

// Menu Item interface
export interface MenuItem extends CosmicObject {
  type: 'menu-items';
  metadata: {
    name?: string;
    description?: string;
    price?: number;
    category?: {
      key: string;
      value: MenuCategory;
    };
    restaurant?: Restaurant | string;
    food_image?: {
      url: string;
      imgix_url: string;
    };
    available?: boolean;
  };
}

// Order interface
export interface Order extends CosmicObject {
  type: 'orders';
  metadata: {
    order_number?: string;
    customer_name?: string;
    customer_phone?: string;
    delivery_address?: string;
    restaurant?: Restaurant;
    items_ordered?: MenuItem[];
    total_amount?: number;
    status?: {
      key: string;
      value: OrderStatus;
    };
    order_date?: string;
  };
}

// Type literals for select-dropdown values (matching content model exactly)
export type CuisineType = 'Italian' | 'Mexican' | 'Asian' | 'American' | 'Indian';
export type MenuCategory = 'Appetizers' | 'Entrees' | 'Desserts' | 'Beverages';
export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Preparing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards for runtime validation
export function isRestaurant(obj: CosmicObject): obj is Restaurant {
  return obj.type === 'restaurants';
}

export function isMenuItem(obj: CosmicObject): obj is MenuItem {
  return obj.type === 'menu-items';
}

export function isOrder(obj: CosmicObject): obj is Order {
  return obj.type === 'orders';
}

// Utility types
export type CreateOrderData = Omit<Order, 'id' | 'created_at' | 'modified_at'>;