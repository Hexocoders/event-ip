'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface TicketInfo {
  name: string;
  email: string;
  status: string;
  qr_code: string;
}

export default function QRScanner() {
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!scannerInitialized) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        /* verbose= */ false
      );

      scanner.render(async (decodedText) => {
        try {
          // Verify the ticket in the database
          const { data: ticket, error: ticketError } = await supabase
            .from('tickets')
            .select('*, events(title)')
            .eq('qr_code', decodedText)
            .single();

          if (ticketError) throw ticketError;

          if (!ticket) {
            setError('Invalid ticket');
            return;
          }

          if (ticket.status === 'used') {
            setError('Ticket has already been used');
            return;
          }

          // Get user information
          const { data: userData, error: userError } = await supabase
            .from('auth.users')
            .select('email')
            .eq('id', ticket.user_id)
            .single();

          if (userError) throw userError;

          setTicketInfo({
            name: ticket.name || 'N/A',
            email: userData.email,
            status: ticket.status,
            qr_code: ticket.qr_code
          });

          // Clear any previous errors
          setError(null);
        } catch (err) {
          setError('Error validating ticket');
          console.error('Error:', err);
        }
      }, (error) => {
        console.error('Scanner error:', error);
      });

      setScannerInitialized(true);

      return () => {
        scanner.clear();
      };
    }
  }, [scannerInitialized]);

  const handleAdmit = async () => {
    if (!ticketInfo) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: 'used',
          scanned_at: new Date().toISOString(),
        })
        .eq('qr_code', ticketInfo.qr_code);

      if (error) throw error;

      setTicketInfo(null);
      setError('Ticket successfully validated');
    } catch (err) {
      setError('Error admitting ticket');
      console.error('Error:', err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Scan Ticket QR Code</h2>
      
      <div id="qr-reader" className="mb-4"></div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {ticketInfo && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Ticket Information</h3>
          <div className="mb-4">
            <p><strong>Name:</strong> {ticketInfo.name}</p>
            <p><strong>Email:</strong> {ticketInfo.email}</p>
            <p><strong>Status:</strong> {ticketInfo.status}</p>
          </div>
          <button
            onClick={handleAdmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Admit
          </button>
        </div>
      )}
    </div>
  );
}