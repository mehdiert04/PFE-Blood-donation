import React from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './components/auth/AuthPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import HomePage from './components/home/HomePage';

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
          { path: 'register', element: <RegisterForm /> }
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

