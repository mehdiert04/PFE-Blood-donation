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
import ReceveurProfile from './pages/receveur/Profile';
import ReceveurLayout from './pages/receveur/ReceveurLayout';
import DonneurDashboard from './pages/donneur/Dashboard';
import DonneurAppointments from './pages/donneur/Appointments';
import DonneurHistory from './pages/donneur/History';
import DonneurProfile from './pages/donneur/Profile';
import DonneurBloodDemands from './pages/donneur/BloodDemands';
import DonneurLayout from './pages/donneur/DonneurLayout';
import Campaigns from './pages/public/Campaigns';
import BloodRequests from './pages/public/BloodRequests';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Hospital Components
import HospitalLayout from './pages/hospital/HospitalLayout';
import DonorRequests from './pages/hospital/DonorRequests';
import HospitalDashboard from './pages/hospital/Dashboard';

// Layout wrapper if needed later (e.g., for header/footer on other pages)
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="content-wrapper">
        <Outlet />
      </div>
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
      { path: '/campaigns', element: <Campaigns /> },
      { path: '/request-blood', element: <BloodRequests /> },
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
        element: <ProtectedRoute allowedRoles={['donneur']} />,
        children: [
          {
            path: 'donneur',
            element: <DonneurLayout />,
            children: [
              { path: 'dashboard', element: <DonneurDashboard /> },
              { path: 'demands', element: <DonneurBloodDemands /> },
              { path: 'appointments', element: <DonneurAppointments /> },
              { path: 'history', element: <DonneurHistory /> },
              { path: 'profile', element: <DonneurProfile /> },
              { path: '', element: <Navigate to="dashboard" replace /> }
            ]
          }
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
              { path: 'profile', element: <ReceveurProfile /> },
              { path: '', element: <Navigate to="dashboard" replace /> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['hopital']} />,
        children: [
          {
            path: 'hopital',
            element: <HospitalLayout />,
            children: [
              { path: 'dashboard', element: <HospitalDashboard /> },
              { path: 'donor-requests', element: <DonorRequests /> },
              { path: 'appointments', element: <div>Hospital Appointments (Coming Soon)</div> },
              { path: 'profile', element: <div>Hospital Profile (Coming Soon)</div> },
              { path: '', element: <Navigate to="donor-requests" replace /> }
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

