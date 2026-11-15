import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin.jsx';

/**
 * Minimal Admin Sidebar & Mobile Floating Navigation:
 * - Desktop: Fixed sidebar on left with brand, Dashboard, Donors, and Sign Out.
 * - Mobile: Clean top brand bar with Sign Out, and floating icon buttons at the bottom.
 * Strictly contains ONLY TWO navigation items:
 * 1. Dashboard (/admin)
 * 2. Donors (/admin/donors)
 * Pure native inline SVGs only.
 */
export default function AdminSidebar() {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true },
    { name: 'Donors', path: '/admin/donors', end: false },
  ];

  return (
    <>
      {/* Mobile Top Header with Brand and Sign Out */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-[#EAEAEA] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base tracking-tight text-[#151515]">
            Blood Connect
          </span>
          <span className="font-extrabold text-base tracking-tight text-[#D92735]">
            Kerala
          </span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#737373]">
            Admin
          </span>
        </div>

        {/* Mobile Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#666666] hover:text-[#D92735] hover:bg-red-50 border border-[#EAEAEA] transition-colors cursor-pointer"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <span>Sign Out</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#EAEAEA] flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#EAEAEA]">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#151515]">
                Blood Connect
              </span>
              <span className="font-extrabold text-lg tracking-tight text-[#D92735]">
                Kerala
              </span>
            </div>
          </div>

          {/* Navigation Links: ONLY TWO ITEMS (Dashboard, Donors) */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#D92735]/10 text-[#D92735]'
                      : 'text-[#666666] hover:text-[#151515] hover:bg-[#F5F5F5]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Red Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#D92735]" />
                    )}
                    <span className="ml-1">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer: Logout */}
        <div className="p-4 border-t border-[#EAEAEA]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#666666] hover:text-[#D92735] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span>Sign Out</span>
            <span className="text-base leading-none">→</span>
          </button>
        </div>
      </aside>

      {/* Mobile Floating Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-[#EAEAEA] rounded-full p-1.5 shadow-xl shadow-black/15 flex items-center gap-2"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={item.name}
            aria-label={item.name}
            className={({ isActive }) =>
              `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#D92735] text-white shadow-md shadow-[#D92735]/30 scale-105'
                  : 'text-[#737373] hover:text-[#151515] hover:bg-[#F5F5F5] active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.name === 'Dashboard' ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={isActive ? '2.4' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={isActive ? '2.4' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

