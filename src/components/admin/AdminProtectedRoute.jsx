import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin.jsx';
import LoaderOne from '../ui/loader-one';

/**
 * AdminProtectedRoute:
 * Protects admin routes against unauthenticated or unauthorized access.
 * Displays smooth motion loading animation while session/profile is verifying.
 */
export default function AdminProtectedRoute() {
  const { isAuthenticated, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-xl shadow-black/5 flex flex-col items-center max-w-xs w-full text-center">
          <LoaderOne color="bg-[#D92735]" />
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#737373]">
            Verifying Administrator
          </p>
          <span className="mt-1 text-[11px] text-[#999999]">Checking secure credentials</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

