"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import withAuth from '../../../components/authHOC';
import { acceptRequest, updateDonationRequest, getDonationRequestById, denyRequest, deleteDonationRequest } from '../../../api/donation';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getUserById } from '../../../api/user';
import { fetchCurrentUser } from '../../../redux/userSlice';

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
  address?: string;
  acceptedByCurrentUser?: boolean;
}

const RequestDetailPage: React.FC = () => {
  const params = useParams();
  const requestId = Number(params?.id);
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState<'idle'|'loading'|'error'>('idle');
  const [actionLoading, setActionLoading] = useState(false);
  const [decision, setDecision] = useState<'accept'|'deny'|''>('');
  const [message, setMessage] = useState('');
  const [requestor, setRequestor] = useState<{ username?: string; email?: string; contactNumber?: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [editQty, setEditQty] = useState<number>(0);
  const [editBloodType, setEditBloodType] = useState<string>('');
  const [editMessage, setEditMessage] = useState<string>('');
  const [accepted, setAccepted] = useState(false);
  const currentUser = useSelector((state: any) => state.user?.data || {});
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Ensure current user profile is loaded for permission checks
    if (!currentUser?.id) {
      dispatch(fetchCurrentUser() as any);
    }
  }, []);

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
        setAccepted(!!req?.acceptedByCurrentUser);
        // Fetch requestor contact info
        if (req?.userId) {
          try {
            const userRes = await getUserById(String(req.userId));
            const user = userRes?.user || userRes;
            setRequestor({ username: user?.username, email: user?.email, contactNumber: user?.contactNumber });
          } catch {
            // ignore
          }
        }
        setLoading('idle');
      } catch (e) {
        setLoading('error');
      }
    };
    fetchDetail();
  }, [requestId]);

  const isOwn = !!detail && typeof detail.userId === 'number' && currentUser?.id === detail.userId;
  const isDonor = !!currentUser?.isDonor;
  const canAccept = !!detail && isDonor && !detail.isFulfilled && !isOwn && !accepted;

  const handleDecision = async () => {
    if (!detail || !decision) return;
    setActionLoading(true);
    try {
      if (decision === 'accept') {
        await acceptRequest(detail.id);
        setAccepted(true);
      } else if (decision === 'deny') {
        await denyRequest(detail.id, message);
      }
      // Send message to requestor via messages API (optional)
      if (message.trim()) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createMessage`, {
            recipientId: detail.userId,
            content: message,
            messageType: 'text',
          }, { withCredentials: true });
        } catch (err) {
          console.warn('Failed to send message to requestor:', err);
        }
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
      if (!message.trim()) {
        alert('Please write a message for the donor before marking as fulfilled.');
        setActionLoading(false);
        return;
      }
      await updateDonationRequest(String(detail.id), { isFulfilled: true } as any);
      // Send a thank-you message to the donor via messages API (if donor info is available)
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createMessage`, {
          recipientId: detail.userId, // requestor id; if we tracked donor acceptance we could send to donor
          content: message,
          messageType: 'text',
        }, { withCredentials: true });
      } catch {}
      alert('Marked as fulfilled. Your message has been sent.');
    } catch (e: any) {
      alert(`Failed to mark fulfilled: ${e?.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = () => {
    if (!detail) return;
    setEditing(true);
    setEditQty(Number(detail.quantity) || 0);
    setEditBloodType(detail.bloodType || '');
    setEditMessage(detail.message || '');
  };

  const saveEdit = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await updateDonationRequest(String(detail.id), { quantity: editQty, bloodType: editBloodType, message: editMessage } as any);
      setDetail({ ...detail, quantity: editQty, bloodType: editBloodType, message: editMessage });
      setEditing(false);
    } catch (e: any) {
      alert(`Failed to update: ${e?.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const onDelete = async () => {
    if (!detail) return;
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await deleteDonationRequest(detail.id);
      alert('Request deleted successfully');
      router.push('/dashboard/donor-requests?page=1');
    } catch (e: any) {
      alert(`Failed to delete: ${e?.message || 'Unknown error'}`);
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
          {accepted && (
            <p className="mb-2"><span className="px-2 py-1 text-xs rounded bg-green-200 text-green-800">accepted by you</span></p>
          )}
          <p className="text-sm text-gray-600">Blood Type: <span className="font-semibold">{detail.bloodType}</span></p>
          <p className="text-sm text-gray-600">Quantity: <span className="font-semibold">{detail.quantity} ml</span></p>
          <p className="text-sm text-gray-600">Address: <span className="font-semibold">{detail.address || 'Unknown'}</span></p>
          {typeof detail.latitude === 'number' && typeof detail.longitude === 'number' && (
            <div className="mt-4 w-full h-48">
              <iframe
                title="Request Location"
                className="w-full h-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(detail.longitude as number)-0.01},${(detail.latitude as number)-0.01},${(detail.longitude as number)+0.01},${(detail.latitude as number)+0.01}&layer=mapnik&marker=${detail.latitude},${detail.longitude}`}
              />
            </div>
          )}

          {requestor && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h2 className="text-md font-semibold mb-2">Requestor Contact</h2>
              <p className="text-sm text-gray-700">Name: <span className="font-medium">{requestor.username || 'N/A'}</span></p>
              <p className="text-sm text-gray-700">Email: <span className="font-medium">{requestor.email || 'N/A'}</span></p>
              <p className="text-sm text-gray-700">Contact Number: <span className="font-medium">{requestor.contactNumber || 'N/A'}</span></p>
            </div>
          )}

          {canAccept && (
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
          )}

          {isOwn && (
            <div className="mt-8 border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Requestor actions</h2>
              <p className="text-sm text-gray-600">Only you (the requestor) can mark this as fulfilled, edit or delete the request.</p>
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Message for the donor</label>
                <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full border rounded p-2 min-h-[96px]" placeholder="Share appreciation or coordination details..." />
                <p className="text-xs text-gray-500 mt-1">This message is required to mark the request as fulfilled.</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button disabled={actionLoading} onClick={markFulfilledByRequestor} className="px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-50">Mark as Fulfilled</button>
                <button disabled={actionLoading} onClick={startEditing} className="px-4 py-2 rounded bg-yellow-500 text-white disabled:opacity-50">Edit</button>
                <button disabled={actionLoading} onClick={onDelete} className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50">Delete</button>
              </div>
              {editing && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Quantity (ml)</label>
                      <input type="number" value={editQty} onChange={(e)=>setEditQty(Number(e.target.value))} className="w-full border rounded p-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Blood Type</label>
                      <input type="text" value={editBloodType} onChange={(e)=>setEditBloodType(e.target.value)} className="w-full border rounded p-2" placeholder="e.g., O+, A-" />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm text-gray-700 mb-1">Message</label>
                      <textarea value={editMessage} onChange={(e)=>setEditMessage(e.target.value)} className="w-full border rounded p-2 min-h-[96px]" placeholder="Optional details..." />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button disabled={actionLoading} onClick={saveEdit} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50">Save</button>
                    <button disabled={actionLoading} onClick={()=>setEditing(false)} className="px-4 py-2 rounded bg-gray-300 text-gray-800 disabled:opacity-50">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default withAuth(RequestDetailPage);