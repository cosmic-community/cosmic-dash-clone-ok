import { MenuItem } from '@/types'
import MenuItemCard from '@/components/MenuItemCard'

interface MenuSectionProps {
  category: string
  items: MenuItem[]
}

export default function MenuSection({ category, items }: MenuSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}