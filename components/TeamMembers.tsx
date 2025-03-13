'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaUserPlus, FaTrash } from 'react-icons/fa';

interface TeamMember {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

interface TeamMembersProps {
  eventId: string;
}

export default function TeamMembers({ eventId }: TeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('team-member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTeamMembers();
  }, [eventId]);

  const fetchTeamMembers = async () => {
    try {
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .eq('event_id', eventId);

      if (membersError) throw membersError;

      setTeamMembers(members.map(member => ({
        ...member,
        email: member.user.email
      })));
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      // First, check if the user exists
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', newMemberEmail)
        .single();

      if (userError) {
        setError('User not found. They must have an account to be added as a team member.');
        return;
      }

      // Add the team member
      const { data, error } = await supabase
        .from('team_members')
        .insert([
          {
            event_id: eventId,
            user_id: userData.id,
            role: newMemberRole
          }
        ])
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .single();

      if (error) throw error;

      setTeamMembers([...teamMembers, {
        ...data,
        email: data.user.email
      }]);
      setNewMemberEmail('');
      setNewMemberRole('team-member');
      setError(null);
    } catch (error) {
      console.error('Error adding team member:', error);
      setError('Failed to add team member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error removing team member:', error);
      setError('Failed to remove team member');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="p-2 border rounded col-span-2"
          />
          <select
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="team-member">Team Member</option>
            <option value="admin">Admin</option>
            <option value="coordinator">Coordinator</option>
          </select>
        </div>
        <button
          onClick={handleAddMember}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <FaUserPlus className="mr-2" />
          Add Team Member
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-4">{member.email}</td>
                <td className="p-4 capitalize">{member.role}</td>
                <td className="p-4">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleRemoveMember(member.id)}
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
    </div>
  );
} 