"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import withAuth from '../../../components/authHOC';
import { acceptRequest, updateDonationRequest, getDonationRequestById, denyRequest } from '../../../api/donation';
import axios from 'axios';

interface RequestDetail {
  id: number;
  userId: number;
  bloodType: string;
  quantity: number;
  isFulfilled: boolean;
  message?: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

const RequestDetailPage: React.FC = () => {
  const params = useParams();
  const requestId = Number(params?.id);
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState<'idle'|'loading'|'error'>('idle');
  const [actionLoading, setActionLoading] = useState(false);
  const [decision, setDecision] = useState<'accept'|'deny'|''>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!requestId) return;
      setLoading('loading');
      try {
        const res = await getDonationRequestById(requestId);
        const req = res?.donationRequests?.[0] || res?.donationRequest || res;
        const latitude = typeof (req?.latitude) !== 'undefined' ? Number(req.latitude) : undefined;
        const longitude = typeof (req?.longitude) !== 'undefined' ? Number(req.longitude) : undefined;
        setDetail({ ...req, latitude, longitude });
        setLoading('idle');
      } catch (e) {
        setLoading('error');
      }
    };
    fetchDetail();
  }, [requestId]);

  const handleDecision = async () => {
    if (!detail || !decision) return;
    setActionLoading(true);
    try {
      if (decision === 'accept') {
        await acceptRequest(detail.id);
      } else if (decision === 'deny') {
        await denyRequest(detail.id, message);
      }
      // Send message to requestor via messages API
      if (message.trim()) {
        await axios.post(`/api/messages/createMessage`, {
          receiverId: detail.userId,
          content: message,
          messageType: 'text',
        }, { withCredentials: true });
      }
      alert('Action processed successfully');
    } catch (e: any) {
      alert(`Failed to process: ${e?.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const markFulfilledByRequestor = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await updateDonationRequest(String(detail.id), { isFulfilled: true } as any);
      alert('Marked as fulfilled.');
    } catch (e: any) {
      alert(`Failed to mark fulfilled: ${e?.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Header isLoggedin={true} />
      {loading === 'loading' && <p className="text-gray-500">Loading...</p>}
      {loading === 'error' && <p className="text-red-600">Failed to load request.</p>}
      {detail && (
        <div className="bg-white rounded shadow p-4">
          <h1 className="text-xl font-bold mb-2">Request #{detail.id}</h1>
          <p className="text-sm text-gray-600">Blood Type: <span className="font-semibold">{detail.bloodType}</span></p>
          <p className="text-sm text-gray-600">Quantity: <span className="font-semibold">{detail.quantity} ml</span></p>
          {typeof detail.latitude === 'number' && typeof detail.longitude === 'number' && (
            <div className="mt-4 w-full h-48">
              <iframe
                title="Request Location"
                className="w-full h-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(detail.longitude as number)-0.01},${(detail.latitude as number)-0.01},${(detail.longitude as number)+0.01},${(detail.latitude as number)+0.01}&layer=mapnik&marker=${detail.latitude},${detail.longitude}`}
              />
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Your decision</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className={`px-3 py-2 rounded ${decision==='accept'?'bg-green-600 text-white':'bg-green-100 text-green-700'}`} onClick={() => setDecision('accept')}>Accept</button>
              <button className={`px-3 py-2 rounded ${decision==='deny'?'bg-red-600 text-white':'bg-red-100 text-red-700'}`} onClick={() => setDecision('deny')}>Refuse</button>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">Message to requestor</label>
              <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full border rounded p-2 min-h-[96px]" placeholder="Optional message..." />
            </div>

            <div className="mt-4">
              <button disabled={actionLoading || !decision} onClick={handleDecision} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>

          <div className="mt-8 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Requestor validation</h2>
            <p className="text-sm text-gray-600">Once accepted and fulfilled, the requestor should mark this request as fulfilled.</p>
            <button disabled={actionLoading} onClick={markFulfilledByRequestor} className="mt-2 px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-50">Mark as Fulfilled</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(RequestDetailPage);