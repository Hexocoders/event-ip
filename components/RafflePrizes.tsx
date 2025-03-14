'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaGift, FaTrophy, FaTicketAlt } from 'react-icons/fa';

interface RafflePrize {
  id: string;
  event_id: string;
  prize_type: string;
  prize_value: string;
  winner_ticket_id: string | null;
  draw_date: string | null;
  winner?: {
    name: string;
    email: string;
  };
}

interface RafflePrizesProps {
  eventId: string;
}

export default function RafflePrizes({ eventId }: RafflePrizesProps) {
  const [prizes, setPrizes] = useState<RafflePrize[]>([]);
  const [newPrize, setNewPrize] = useState({
    prize_type: 'ticket',
    prize_value: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPrizes();
  }, [eventId, fetchPrizes]);

  const fetchPrizes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('raffle_prizes')
        .select(`
          *,
          winner:winner_ticket_id (
            user:user_id (
              email
            ),
            name
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      setPrizes(data.map(prize => ({
        ...prize,
        winner: prize.winner ? {
          name: prize.winner.name,
          email: prize.winner.user.email,
        } : undefined,
      })));
    } catch (error) {
      console.error('Error fetching prizes:', error);
      setError('Failed to load prizes');
    } finally {
      setLoading(false);
    }
  }, [eventId, supabase]);

  const handleAddPrize = async () => {
    try {
      const { data, error } = await supabase
        .from('raffle_prizes')
        .insert([
          {
            event_id: eventId,
            ...newPrize,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setPrizes([...prizes, data]);
      setNewPrize({
        prize_type: 'ticket',
        prize_value: '',
      });
    } catch (error) {
      console.error('Error adding prize:', error);
      setError('Failed to add prize');
    }
  };

  const handleDrawWinner = async (prizeId: string) => {
    try {
      // Get all valid tickets for the event
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, user_id, name')
        .eq('event_id', eventId)
        .eq('status', 'valid');

      if (ticketsError) throw ticketsError;

      if (!tickets || tickets.length === 0) {
        setError('No valid tickets available for the draw');
        return;
      }

      // Randomly select a winner
      const winnerTicket = tickets[Math.floor(Math.random() * tickets.length)];

      // Update the prize with the winner
      const { data: updatedPrize, error: updateError } = await supabase
        .from('raffle_prizes')
        .update({
          winner_ticket_id: winnerTicket.id,
          draw_date: new Date().toISOString(),
        })
        .eq('id', prizeId)
        .select(`
          *,
          winner:winner_ticket_id (
            user:user_id (
              email
            ),
            name
          )
        `)
        .single();

      if (updateError) throw updateError;

      // Update the prizes list
      setPrizes(prizes.map(prize => 
        prize.id === prizeId ? {
          ...updatedPrize,
          winner: {
            name: updatedPrize.winner.name,
            email: updatedPrize.winner.user.email,
          },
        } : prize
      ));
    } catch (error) {
      console.error('Error drawing winner:', error);
      setError('Failed to draw winner');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Raffle Prizes</h2>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={newPrize.prize_type}
            onChange={(e) => setNewPrize({ ...newPrize, prize_type: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="ticket">Event Ticket</option>
            <option value="cash">Cash Prize</option>
            <option value="other">Other Prize</option>
          </select>
          <input
            type="text"
            placeholder={newPrize.prize_type === 'cash' ? 'Amount' : 'Prize Description'}
            value={newPrize.prize_value}
            onChange={(e) => setNewPrize({ ...newPrize, prize_value: e.target.value })}
            className="p-2 border rounded col-span-2"
          />
        </div>
        <button
          onClick={handleAddPrize}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <FaGift className="mr-2" />
          Add Prize
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              {prize.prize_type === 'ticket' ? (
                <FaTicketAlt className="text-2xl text-blue-500 mr-3" />
              ) : prize.prize_type === 'cash' ? (
                <span className="text-2xl mr-3">💰</span>
              ) : (
                <FaGift className="text-2xl text-purple-500 mr-3" />
              )}
              <div>
                <h3 className="font-bold">
                  {prize.prize_type === 'cash' ? `$${prize.prize_value}` : prize.prize_value}
                </h3>
                <p className="text-sm text-gray-500 capitalize">{prize.prize_type}</p>
              </div>
            </div>

            {prize.winner ? (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <div className="flex items-center mb-2">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  <span className="font-semibold">Winner</span>
                </div>
                <p className="text-sm">{prize.winner.name}</p>
                <p className="text-sm text-gray-500">{prize.winner.email}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Drawn on {new Date(prize.draw_date!).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <button
                onClick={() => handleDrawWinner(prize.id)}
                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Draw Winner
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 