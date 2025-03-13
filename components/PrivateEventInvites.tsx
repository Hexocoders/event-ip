'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaWhatsapp, FaEnvelope, FaTrash, FaLink } from 'react-icons/fa';

interface Invite {
  id: string;
  name: string;
  email: string;
  phone: string;
  invite_status: string;
}

interface PrivateEventInvitesProps {
  eventId: string;
}

export default function PrivateEventInvites({ eventId }: PrivateEventInvitesProps) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newInvite, setNewInvite] = useState({ name: '', email: '', phone: '' });
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchInvites();
    generateInviteLink();
  }, [eventId]);

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('private_event_invites')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error('Error fetching invites:', error);
      setError('Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = async () => {
    // Generate a unique link for the event that people can use to add themselves to the invite list
    const link = `${window.location.origin}/events/${eventId}/join`;
    setInviteLink(link);
  };

  const handleAddInvite = async () => {
    try {
      const { data, error } = await supabase
        .from('private_event_invites')
        .insert([
          {
            event_id: eventId,
            ...newInvite,
            invite_status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      setInvites([...invites, ...(data || [])]);
      setNewInvite({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error adding invite:', error);
      setError('Failed to add invite');
    }
  };

  const handleRemoveInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('private_event_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      setInvites(invites.filter(invite => invite.id !== inviteId));
    } catch (error) {
      console.error('Error removing invite:', error);
      setError('Failed to remove invite');
    }
  };

  const handleSendInvites = async () => {
    try {
      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Update invite status and trigger notifications
      const { error } = await supabase.functions.invoke('send-event-invites', {
        body: {
          eventId,
          eventDetails: event,
          invites
        }
      });

      if (error) throw error;

      // Update local state
      setInvites(invites.map(invite => ({
        ...invite,
        invite_status: 'sent'
      })));
    } catch (error) {
      console.error('Error sending invites:', error);
      setError('Failed to send invites');
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Invite Link</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 p-2 border rounded bg-gray-50"
          />
          <button
            onClick={copyInviteLink}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaLink className="mr-2" />
            Copy Link
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Invite</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newInvite.name}
            onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newInvite.email}
            onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone (WhatsApp)"
            value={newInvite.phone}
            onChange={(e) => setNewInvite({ ...newInvite, phone: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddInvite}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Invite
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Invite List</h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr key={invite.id} className="border-t">
                  <td className="p-4">{invite.name}</td>
                  <td className="p-4">{invite.email}</td>
                  <td className="p-4">{invite.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      invite.invite_status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invite.invite_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRemoveInvite(invite.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invites.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSendInvites}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <FaWhatsapp className="mr-2" />
              <FaEnvelope className="mr-2" />
              Send Invites
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 