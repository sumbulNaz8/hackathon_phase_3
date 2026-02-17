'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, loading, user, token } = useAuth();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // Mark when component has mounted on client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    console.log('🔵 ProtectedRoute State:');
    console.log('  - hasMounted:', hasMounted);
    console.log('  - loading:', loading);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - token exists:', !!token);
    console.log('  - user:', user?.email);

    // Only redirect after we've mounted and loading is complete
    if (hasMounted && !loading && !isAuthenticated) {
      console.log('🔴 Not authenticated after loading complete, redirecting to:', redirectTo);
      router.replace(redirectTo);
    }
  }, [hasMounted, loading, isAuthenticated, token, user, redirectTo, router]);

  // Don't render anything until mounted on client (prevents hydration issues)
  if (!hasMounted) {
    console.log('⏳ ProtectedRoute - waiting for mount');
    return <Loading />;
  }

  // Show loading while checking authentication
  if (loading) {
    console.log('⏳ ProtectedRoute - checking authentication...');
    return <Loading />;
  }

  // If authenticated, render children
  if (isAuthenticated) {
    console.log('✅ ProtectedRoute - authenticated, rendering dashboard for:', user?.email);
    return <>{children}</>;
  }

  // Not authenticated - show loading while redirect happens
  console.log('⏳ ProtectedRoute - redirecting to login...');
  return <Loading />;
};

export default ProtectedRoute;
