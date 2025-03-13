import { FiMusic, FiActivity, FiBriefcase, FiCamera, FiLayout } from 'react-icons/fi'

const categories = [
  { icon: FiMusic, name: 'Music' },
  { icon: FiActivity, name: 'Sport' },
  { icon: FiLayout, name: 'Exhibition' },
  { icon: FiBriefcase, name: 'Business' },
  { icon: FiCamera, name: 'Photography' },
]

export default function Categories() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {categories.map((category) => (
        <div
          key={category.name}
          className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <category.icon className="mb-2 h-6 w-6 text-purple-600" />
          <span className="text-sm text-gray-600">{category.name}</span>
        </div>
      ))}
    </div>
  )
} 