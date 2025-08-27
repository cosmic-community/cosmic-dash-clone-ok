# DoorDash Clone

![App Preview](https://imgix.cosmicjs.com/4243dde0-837d-11f0-8ece-89921cbea84a-photo-1555396273-367ea4eb4db5-1756323444814.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern food delivery application built with Next.js and powered by Cosmic CMS. Browse restaurants, explore menus, and manage food delivery orders with real-time status tracking.

## Features

- 🍕 **Restaurant Discovery** - Browse restaurants by cuisine type with ratings and delivery information
- 📱 **Responsive Design** - Optimized for mobile and desktop experiences
- 🍔 **Dynamic Menus** - View categorized menu items with detailed descriptions and pricing
- 📦 **Order Management** - Complete order lifecycle from placement to delivery tracking
- ⚡ **Real-time Updates** - Track order status through all delivery stages
- 🎨 **Modern UI** - Clean, intuitive interface with high-quality food photography
- 🔍 **Search & Filter** - Find restaurants and menu items easily

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a Doordash clone"

### Code Generation Prompt

> Build a Doordash clone using Next.js

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless content management
- **React** - Component-based UI library

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Cosmic credentials:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Restaurants

```typescript
import { cosmic } from '@/lib/cosmic'

export async function getRestaurants() {
  try {
    const response = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as Restaurant[]
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

### Fetching Menu Items by Restaurant

```typescript
export async function getMenuItemsByRestaurant(restaurantId: string) {
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
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

## Cosmic CMS Integration

This application integrates with three main Cosmic object types:

- **Restaurants** - Restaurant information, cuisine types, ratings, and delivery details
- **Menu Items** - Food items with categories, prices, descriptions, and availability
- **Orders** - Customer orders with items, status tracking, and delivery information

All content is managed through your Cosmic dashboard, allowing for easy updates to restaurants, menus, and order management.

## Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add your Cosmic environment variables
3. Deploy automatically

### Netlify
1. Connect your repository to Netlify  
2. Set build command to `bun run build`
3. Set publish directory to `.next`
4. Add your Cosmic environment variables

### Manual Deployment
1. Run `bun run build`
2. Upload the `.next` folder to your hosting provider
3. Configure environment variables on your server

For more deployment options, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).