import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AdminProvider } from './context/AdminProvider.jsx';

// Public Layout & Pages
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import RequestBloodPage from './pages/RequestBloodPage';
import AllDonorsPage from './pages/AllDonorsPage';

// Admin Components & Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDonorsPage from './pages/admin/AdminDonorsPage';

/**
 * ScrollToTop helper: scrolls window to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Blood Connect Kerala App
 * Full Route Map:
 * - Public: /, /register, /request-blood
 * - Admin Auth: /admin/login
 * - Protected Admin: /admin, /admin/donors
 */
export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/become-a-donor" element={<Navigate to="/register" replace />} />
            <Route path="/request-blood" element={<RequestBloodPage />} />
            <Route path="/request" element={<Navigate to="/request-blood" replace />} />
            <Route path="/all-donors" element={<AllDonorsPage />} />
            <Route path="/blood-groups" element={<Navigate to="/all-donors" replace />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="donors" element={<AdminDonorsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          {/* Fallback to Public Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
