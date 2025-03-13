import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-1">
              <span className="font-righteous text-2xl text-pink-500">Event</span>
              <span className="font-righteous text-2xl text-gray-400">-</span>
              <span className="font-dancing-script text-2xl text-purple-300">ip</span>
            </Link>
            <p className="mt-4 text-purple-200">
              Discover and book amazing events near you. Join our community of event enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-purple-300 hover:text-white transition">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-purple-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-purple-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-purple-300 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-purple-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-purple-300 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-purple-300 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-300 hover:text-white transition">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-purple-300 hover:text-white transition">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-purple-300 hover:text-white transition">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-purple-300 hover:text-white transition">
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-purple-200">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-purple-800 text-white placeholder-purple-300 rounded-l focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-r hover:bg-pink-600 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-purple-800">
          <div className="text-center text-purple-300">
            <p>&copy; {new Date().getFullYear()} Eventip. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
