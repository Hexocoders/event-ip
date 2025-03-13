'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMapPin } from 'react-icons/fi'
import { FiMusic, FiActivity, FiBriefcase, FiCamera } from 'react-icons/fi'

export default function Onboarding() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [additionalLocations, setAdditionalLocations] = useState<string[]>([])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const addLocation = () => {
    if (location.trim()) {
      setAdditionalLocations(prev => [...prev, location.trim()])
      setLocation('')
    }
  }

  const handleFinish = () => {
    // Here you would typically save the user's preferences to your backend
    console.log('Selected interests:', selectedInterests)
    console.log('Locations:', [location, ...additionalLocations].filter(Boolean))
    router.push('/') // Redirect to home page after completion
  }

  const isSelected = (interest: string) => selectedInterests.includes(interest)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-16">
          {/* Progress Header */}
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-black"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Tell us</h2>
            <div className="space-y-12">
              {/* Question 1 */}
              <div>
                <h3 className="text-3xl font-bold mb-8">What Are Your Interests?</h3>
                <div className="space-y-8">
                  {/* Music Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <FiMusic className="mr-2" />
                      <h4 className="text-xl font-semibold">Music</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Blues & Jazz', 'Country', 'EDM', 'Hip Hop', 'RAP', 'Pop', 'R&B', 'Electronic', 'Experimental', 'Psychedelic'].map((genre) => (
                        <button
                          key={genre}
                          onClick={() => toggleInterest(genre)}
                          className={`px-4 py-2 rounded-full ${
                            isSelected(genre)
                              ? 'bg-black text-white hover:bg-gray-900'
                              : 'bg-gray-100 hover:bg-gray-200'
                          } text-sm transition-colors`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sport Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <FiActivity className="mr-2" />
                      <h4 className="text-xl font-semibold">Sport</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Football (soccer)', 'Basketball', 'Tennis', 'Baseball', 'Swimming', 'Volleyball', 'Athletics', 'Rugby', 'Ice hockey'].map((sport) => (
                        <button
                          key={sport}
                          onClick={() => toggleInterest(sport)}
                          className={`px-4 py-2 rounded-full ${
                            isSelected(sport)
                              ? 'bg-black text-white hover:bg-gray-900'
                              : 'bg-gray-100 hover:bg-gray-200'
                          } text-sm transition-colors`}
                        >
                          {sport}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <FiBriefcase className="mr-2" />
                      <h4 className="text-xl font-semibold">Business</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Trade Shows', 'Product Launches', 'Business Seminars', 'Workshops', 'Business Awards', 'Investor Pitch Events'].map((business) => (
                        <button
                          key={business}
                          onClick={() => toggleInterest(business)}
                          className={`px-4 py-2 rounded-full ${
                            isSelected(business)
                              ? 'bg-black text-white hover:bg-gray-900'
                              : 'bg-gray-100 hover:bg-gray-200'
                          } text-sm transition-colors`}
                        >
                          {business}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exhibition Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <FiCamera className="mr-2" />
                      <h4 className="text-xl font-semibold">Exhibition</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Oil paints', 'Canvas', 'Watercolor set', 'Sketchbook', 'Charcoal pencils', 'Chalkboard', 'Pottery wheel', 'Colored pencils', 'Wood carving tools'].map((exhibition) => (
                        <button
                          key={exhibition}
                          onClick={() => toggleInterest(exhibition)}
                          className={`px-4 py-2 rounded-full ${
                            isSelected(exhibition)
                              ? 'bg-black text-white hover:bg-gray-900'
                              : 'bg-gray-100 hover:bg-gray-200'
                          } text-sm transition-colors`}
                        >
                          {exhibition}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <h3 className="text-3xl font-bold mb-8">What is your preferred location?</h3>
                <div className="max-w-md">
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Looking for an event in</p>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="New York, NY"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                  {additionalLocations.map((loc, index) => (
                    <div key={index} className="mb-2 flex items-center">
                      <FiMapPin className="mr-2 text-gray-400" />
                      <span>{loc}</span>
                      <button
                        onClick={() => setAdditionalLocations(prev => prev.filter((_, i) => i !== index))}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addLocation}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <span className="text-xl mr-2">+</span>
                    Add location
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Skip
            </button>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 