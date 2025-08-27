import { MenuItem } from '@/types'
import MenuItemCard from './MenuItemCard'

export interface MenuSectionProps {
  title: string
  items: MenuItem[]
  key?: string
}

export default function MenuSection({ title, items }: MenuSectionProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}