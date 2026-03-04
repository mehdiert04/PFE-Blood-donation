import React from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './components/auth/AuthPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import VerifyEmail from './components/auth/VerifyEmail';
import AccountVerified from './components/auth/AccountVerified';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import HomePage from './components/home/HomePage';
import ReceveurDashboard from './pages/receveur/Dashboard';
import BloodDemandsList from './pages/receveur/DemandsList';
import CreateBloodDemand from './pages/receveur/CreateDemand';
import BloodDemandDetails from './pages/receveur/DemandDetails';
import ReceveurLayout from './pages/receveur/ReceveurLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout wrapper if needed later (e.g., for header/footer on other pages)
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Outlet />
    </div>
  );
};

// Route Configuration Object
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: 'auth/*',
        element: <AuthPage />,
        children: [
          { path: 'login', element: <LoginForm /> },
          { path: 'register', element: <RegisterForm /> },
          { path: 'verify-email', element: <VerifyEmail /> },
          { path: 'account-verified', element: <AccountVerified /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password', element: <ResetPassword /> }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['receveur']} />,
        children: [
          {
            path: 'receveur',
            element: <ReceveurLayout />,
            children: [
              { path: 'dashboard', element: <ReceveurDashboard /> },
              { path: 'demands', element: <BloodDemandsList /> },
              { path: 'demands/create', element: <CreateBloodDemand /> },
              { path: 'demands/:id', element: <BloodDemandDetails /> },
              { path: '', element: <Navigate to="dashboard" replace /> }
            ]
          }
        ]
      },
      // Fallback for 404
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
];

function App() {
  const element = useRoutes(routes);
  return (
    <ThemeProvider>
      {element}
    </ThemeProvider>
  );
}

export default App;

