import React from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import AuthPage from './components/auth/AuthPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

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
    element: <MainLayout />, // Potentially wrap unrelated routes
    children: [
      { path: '/', element: <Navigate to="/auth" replace /> },
      {
        path: 'auth/*',
        element: <AuthPage />,
        // Nested routes inside AuthPage if we refactor AuthPage to use Outlet
        // For now, AuthPage manages its own state, which is fine for simple login/register toggle.
        // If we want dedicated URLs for /auth/login and /auth/register:
        children: [
          { path: 'login', element: <LoginForm /> },
          { path: 'register', element: <RegisterForm /> }
        ]
      },
      // Fallback for 404
      { path: '*', element: <Navigate to="/auth" replace /> }
    ]
  }
];

function App() {
  // We can use a simple state-based toggle inside AuthPage, 
  // OR we can fully embrace routing for /login and /register.
  // Given the request "work by react router v6 (objects with path elements and children)",
  // I will refactor AuthPage to use Outlet if feasible, or just keep the high-level routing object.

  // Let's implement the object-based routing here.
  const element = useRoutes(routes);
  return element;
}

export default App;
