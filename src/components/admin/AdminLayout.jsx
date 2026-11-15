import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import useSEO from '../../hooks/useSEO';

/**
 * Minimal Admin Layout:
 * Fixed sidebar on desktop, responsive mobile drawer,
 * comfortable content container width with consistent spacing.
 */
export default function AdminLayout() {
  useSEO({
    title: 'Admin Management Portal — Blood Connect Kerala',
    description: 'Internal administration dashboard and donor management for Blood Connect Kerala.',
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row text-[#151515] font-sans">
      <AdminSidebar />
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 pb-24 md:pb-8">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

