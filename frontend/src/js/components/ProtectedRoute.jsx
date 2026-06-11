import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
    const location = useLocation();
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');

    console.log('🛡️ ProtectedRoute checking:', { path: location.pathname, allowedRoles, role });

    if (!token) {
        console.log('❌ No token - redirecting to login');
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        console.log('❌ Role not allowed - redirecting to home');
        // Redirect to appropriate home page if role is not allowed
        if (role === 'super_admin') {
            return <Navigate to="/superadmin/dashboard" replace />;
        } else if (role === 'cashier') {
            return <Navigate to="/cashier/pos" replace />;
        } else {
            return <Navigate to="/tenant/dashboard" replace />;
        }
    }

    console.log('✅ ProtectedRoute - access granted');
    return children;
}
