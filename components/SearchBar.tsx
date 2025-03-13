import { FiSearch, FiMapPin } from 'react-icons/fi'

export default function SearchBar() {
  return (
    <div className="flex w-full max-w-2xl rounded-lg bg-white shadow-lg">
      <div className="flex flex-1 items-center border-r border-gray-200 px-4">
        <FiSearch className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Find the event you're interested in"
          className="w-full py-3 focus:outline-none"
        />
      </div>
      <div className="flex items-center px-4">
        <FiMapPin className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="New York, NY"
          className="w-32 py-3 focus:outline-none"
        />
      </div>
      <button className="rounded-r-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700">
        Search
      </button>
    </div>
  )
} 