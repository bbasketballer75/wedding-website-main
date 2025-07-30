'use client';

import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingScreen from '../../components/LoadingScreen';

// Code splitting: Lazy load admin page
const AdminPage = React.lazy(() => import('../../page-components/AdminPage'));

function AdminPageRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen message="Loading admin dashboard..." />}>
        <AdminPage />
      </Suspense>
    </ErrorBoundary>
  );
}

export default AdminPageRoute;
