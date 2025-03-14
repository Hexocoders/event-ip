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
        'reader',
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
        },
        false // verbose flag
      );

      scanner.render(async (decodedText) => {
        try {
          const { data: ticketData, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('qr_code', decodedText)
            .single();

          if (error) throw error;
          setTicketInfo(ticketData);
          scanner.clear();
          setScannerInitialized(false);
        } catch (error) {
          console.error('Error fetching ticket:', error);
          setError('Invalid QR code or ticket not found');
        }
      }, (error) => {
        console.warn(`QR Code scanning failed: ${error}`);
      });

      setScannerInitialized(true);

      return () => {
        scanner.clear();
      };
    }
  }, [scannerInitialized, supabase]);

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
      
      <div id="reader" className="mb-4"></div>

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