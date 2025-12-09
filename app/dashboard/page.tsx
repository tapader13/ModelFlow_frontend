'use client';

import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // show nothing or a loader while checking session
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // will redirect in useEffect
  }

  return (
    <Layout>
      <DashboardOverview />
    </Layout>
  );
}
