'use client';

import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('./AdminPanelContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#080818] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full" />
    </div>
  ),
});

export default function AdminPage() {
  return <AdminPanel />;
}
