
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  requiredPermission?: {
    resource: string;
    action: string;
  };
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login',
  requiredPermission
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasPermission, canAccessRoute } = useUser();

  // For testing: bypass all authentication checks
  // Remove this block when you want to re-enable authentication
  return <>{children}</>;

  // Original authentication logic (commented out for testing)
  /*
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission-based access if required
  if (requiredPermission) {
    if (!hasPermission(requiredPermission.resource, requiredPermission.action)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check route access based on user role
  const currentPath = window.location.pathname;
  if (!canAccessRoute(currentPath)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
  */
}
