'use client';

import { useState } from 'react';
import { FiUser, FiLock, FiCreditCard, FiBell, FiGlobe } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';

interface UserSettings {
  fullName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettings>({
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    language: 'English',
    timezone: 'UTC-5',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  const handleSave = () => {
    // Handle saving settings
    console.log('Saving settings:', settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Settings</h1>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-4">
              {/* Sidebar */}
              <div className="col-span-1 border-r">
                <nav className="p-4 space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                      activeTab === 'profile'
                        ? 'bg-pink-50 text-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiUser />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                      activeTab === 'security'
                        ? 'bg-pink-50 text-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiLock />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                      activeTab === 'billing'
                        ? 'bg-pink-50 text-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiCreditCard />
                    <span>Billing</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                      activeTab === 'notifications'
                        ? 'bg-pink-50 text-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiBell />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                      activeTab === 'preferences'
                        ? 'bg-pink-50 text-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiGlobe />
                    <span>Preferences</span>
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="col-span-3 p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settings.fullName}
                          onChange={(e) =>
                            setSettings({ ...settings, fullName: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) =>
                            setSettings({ ...settings, email: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.phone}
                          onChange={(e) =>
                            setSettings({ ...settings, phone: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">
                            Receive email notifications about your events
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emailNotifications: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Push Notifications</h3>
                          <p className="text-sm text-gray-500">
                            Receive push notifications about your events
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                pushNotifications: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Marketing Emails</h3>
                          <p className="text-sm text-gray-500">
                            Receive marketing and promotional emails
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.marketingEmails}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                marketingEmails: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Preferences</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) =>
                            setSettings({ ...settings, language: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) =>
                            setSettings({ ...settings, timezone: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option>UTC-5 (Eastern Time)</option>
                          <option>UTC-6 (Central Time)</option>
                          <option>UTC-7 (Mountain Time)</option>
                          <option>UTC-8 (Pacific Time)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 