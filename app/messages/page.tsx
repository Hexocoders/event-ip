'use client';

import { useState } from 'react';
import { FiSearch, FiSend, FiPaperclip } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'John Smith',
    lastMessage: 'Hey, about the concert tomorrow...',
    timestamp: '2024-03-01T10:30:00',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    lastMessage: 'The tickets have been sent',
    timestamp: '2024-03-01T09:15:00',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Mike Wilson',
    lastMessage: 'Can you help me with the refund?',
    timestamp: '2024-02-29T18:45:00',
    unreadCount: 1
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'John Smith',
    content: 'Hey, about the concert tomorrow...',
    timestamp: '2024-03-01T10:30:00',
    isRead: false
  },
  {
    id: '2',
    sender: 'You',
    content: 'Yes, what about it?',
    timestamp: '2024-03-01T10:31:00',
    isRead: true
  },
  {
    id: '3',
    sender: 'John Smith',
    content: 'What time should I arrive at the venue?',
    timestamp: '2024-03-01T10:32:00',
    isRead: false
  }
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 pt-16">
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Chat List */}
          <div className="w-80 bg-white border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              {MOCK_CHATS.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? 'bg-pink-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {chat.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {MOCK_CHATS.find(c => c.id === selectedChat)?.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-medium">
                        {MOCK_CHATS.find(c => c.id === selectedChat)?.name}
                      </h2>
                      <span className="text-sm text-green-500">Online</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {MOCK_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'You'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'You' ? 'text-pink-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <FiPaperclip />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 