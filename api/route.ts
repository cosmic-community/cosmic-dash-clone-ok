import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/cosmic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      order_number,
      customer_name,
      customer_phone,
      delivery_address,
      restaurant,
      items_ordered,
      total_amount,
      status,
      order_date
    } = body || {}

    if (!order_number || !customer_name || !delivery_address || !restaurant || !Array.isArray(items_ordered) || typeof total_amount !== 'number' || !status) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const order = await createOrder({
      order_number,
      customer_name,
      customer_phone,
      delivery_address,
      restaurant,
      items_ordered,
      total_amount,
      status,
      order_date
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order (API):', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}


