"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import withAuth from '../../components/authHOC';
import { getDonationRequestsPaginated } from '../../api/donation';
import { useSelector } from 'react-redux';

interface DonorRequestItem {
  id: number;
  userId: number;
  bloodType: string;
  quantity: number;
  isFulfilled: boolean;
  message?: string;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
}

const DonorRequestsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<DonorRequestItem[]>([]);
  const [loading, setLoading] = useState<'idle'|'loading'|'error'>('idle');
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);

  const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
  const limit = 5;

  useEffect(() => {
    const fetchPage = async () => {
      setLoading('loading');
      try {
        const data = await getDonationRequestsPaginated({ page, limit, isFulfilled: false });
        setItems(data.donationRequests || []);
        setPagination(data.pagination || { page, limit, total: 0, totalPages: 1 });
        setLoading('idle');
      } catch (e) {
        setLoading('error');
      }
    };
    fetchPage();
  }, [page]);

  const gotoPage = (p: number) => {
    const next = Math.max(1, Math.min(p, pagination?.totalPages || 1));
    router.push(`/dashboard/donor-requests?page=${next}`);
  };

  const currentUser = useSelector((state: any) => state.user?.data || {});
  const isDonor = !!currentUser?.isDonor;

  return (
    <div className="container mx-auto px-4 py-6">
      <Header isLoggedin={true} />
      <h1 className="text-2xl font-bold mb-4">Requests awaiting donors</h1>

      {loading === 'loading' && <p className="text-gray-500">Loading...</p>}
      {loading === 'error' && <p className="text-red-600">Failed to load requests.</p>}

      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          {items.map((req) => (
            <Link key={req.id} className="block bg-white rounded shadow hover:shadow-md transition p-4" href={`/dashboard/donor-requests/${req.id}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="font-semibold">{req.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-semibold">{req.quantity} ml</p>
                </div>
                <div>
                  <span className="px-2 py-1 text-xs rounded bg-yellow-200">awaiting donors</span>
                </div>
              </div>
              {req.message && <p className="mt-2 text-sm text-gray-700">{req.message}</p>}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {pagination && (
        <div className="flex items-center gap-2 mb-6">
          <button className="px-3 py-2 bg-gray-200 rounded" disabled={pagination.page <= 1} onClick={() => gotoPage(pagination.page - 1)}>Prev</button>
          <span className="text-sm">Page {pagination.page} of {pagination.totalPages}</span>
          <button className="px-3 py-2 bg-gray-200 rounded" disabled={pagination.page >= pagination.totalPages} onClick={() => gotoPage(pagination.page + 1)}>Next</button>
        </div>
      )}

      {/* Simple map using OpenStreetMap static tiles */}
      {items.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Map of request locations</h2>
          <div className="w-full h-64 bg-gray-100 rounded overflow-hidden relative">
            {/* Minimal, static map preview: center on first item if coords exist */}
            {/* We avoid heavy map libraries; for richer maps we can add Leaflet later */}
            {items.some(i => typeof i.latitude === 'number' && typeof i.longitude === 'number') ? (
              (() => {
                const coords = items.filter(i => typeof i.latitude === 'number' && typeof i.longitude === 'number');
                const centerLon = Number(coords[0]?.longitude ?? 0);
                const centerLat = Number(coords[0]?.latitude ?? 0);
                const markers = coords.map(i => `&marker=${Number(i.latitude)},${Number(i.longitude)}`).join('');
                const bbox = `${centerLon - 0.1},${centerLat - 0.1},${centerLon + 0.1},${centerLat + 0.1}`;
                return (
                  <iframe
                    title="Requests Map"
                    className="w-full h-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markers}`}
                  />
                );
              })()
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No coordinates available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(DonorRequestsPage);