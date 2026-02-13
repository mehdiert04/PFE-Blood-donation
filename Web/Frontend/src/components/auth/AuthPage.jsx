import React from 'react';
import { useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine current mode based on URL or default to login
    const isRegister = location.pathname.includes('register');
    const isLogin = location.pathname.includes('login');

    // If path is just /auth, redirect to /auth/login
    if (location.pathname === '/auth' || location.pathname === ('/auth/')) {
        return <Navigate to="/auth/login" replace />;
    }

    const handleSwitchToRegister = () => navigate('/auth/register');
    const handleSwitchToLogin = () => navigate('/auth/login');

    // We can pass props to children using context or cloning elements, 
    // but simpler here since we control the route rendering in App.jsx or via Outlet.
    // Actually, since App.jsx defines children routes, we should use Outlet.
    // BUT, we want to wrap the content in AuthLayout which has props (title/sub).
    // So we need to know WHICH child is active to set the title.

    return (
        <AuthLayout
            title={isRegister ? 'Créer un compte' : 'Bienvenue'}
            subtitle={
                isRegister
                    ? 'Rejoignez la communauté de don de sang.'
                    : 'Connectez-vous pour gérer vos dons ou demandes.'
            }
        >
            <Outlet context={{ onSwitchToRegister: handleSwitchToRegister, onSwitchToLogin: handleSwitchToLogin }} />
        </AuthLayout>
    );
};

export default AuthPage;
