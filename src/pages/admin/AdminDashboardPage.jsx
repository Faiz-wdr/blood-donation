import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminDashboardStats, fetchRecentDonors } from '../../services/adminService';
import { BLOOD_GROUPS } from '../../data/bloodGroups';
import LoaderOne from '../../components/ui/loader-one';
import useSEO from '../../hooks/useSEO';

/**
 * AdminDashboardPage:
 * Minimal dashboard showing 4 key metric cards, verified blood group counts,
 * and the latest 5 donor registrations.
 */
export default function AdminDashboardPage() {
  useSEO({
    title: 'Dashboard — Admin Portal | Blood Connect Kerala',
    description: 'Admin dashboard overview for Blood Connect Kerala.',
    noindex: true,
  });

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    inactive: 0,
    rejected: 0,
    groups: {},
  });
  const [recentDonors, setRecentDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setErrorMsg('');

      const [statsRes, recentRes] = await Promise.all([
        fetchAdminDashboardStats(),
        fetchRecentDonors(5),
      ]);

      if (isMounted) {
        if (statsRes.success) {
          setStats(statsRes.stats);
        } else {
          setErrorMsg(statsRes.error || 'Failed to load dashboard metrics.');
        }

        if (recentRes.success) {
          setRecentDonors(recentRes.donors);
        }

        setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    { title: 'Total Donors', value: stats.total, color: 'text-[#151515]', bg: 'bg-white' },
    { title: 'Verified Donors', value: stats.verified, color: 'text-emerald-600', bg: 'bg-white' },
    { title: 'Pending Verification', value: stats.pending, color: 'text-amber-600', bg: 'bg-white' },
    { title: 'Inactive Donors', value: stats.inactive, color: 'text-[#737373]', bg: 'bg-white' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'inactive':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151515] tracking-tight">
          Dashboard
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* 1. Statistics Cards (4 Cards Only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} border border-[#EAEAEA] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between`}
          >
            <p className="text-xs sm:text-sm font-semibold text-[#737373]">
              {card.title}
            </p>
            <div className={`mt-3 text-2xl sm:text-4xl font-extrabold ${card.color} tracking-tight`}>
              {loading ? (
                <span className="inline-block w-14 h-8 bg-[#EAEAEA] rounded-md animate-pulse" />
              ) : (
                card.value.toLocaleString('en-IN')
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Blood Group Overview (8 Verified & Willing Groups) */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EAEAEA]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#151515]">
              Verified Donors by Blood Group
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {BLOOD_GROUPS.map((group) => {
            const count = stats.groups[group] || 0;
            return (
              <div
                key={group}
                className="bg-[#F5F5F5] border border-[#EAEAEA] rounded-xl p-3 sm:p-4 text-center transition-all hover:bg-white hover:border-[#D92735]/40"
              >
                <span className="text-xs sm:text-sm font-extrabold text-[#D92735] block truncate" title={group}>
                  {group}
                </span>
                <span className="mt-1 text-xl sm:text-2xl font-extrabold text-[#151515] block">
                  {loading ? '—' : count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Donors Table (Latest 5) */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EAEAEA]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#151515]">
              Recent Donor Registrations
            </h2>
          </div>
          <Link
            to="/admin/donors"
            className="text-xs sm:text-sm font-semibold text-[#D92735] hover:text-[#B81E2B] transition-colors"
          >
            View All Donors →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <LoaderOne color="bg-[#D92735]" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">
              Loading recent records...
            </p>
          </div>
        ) : recentDonors.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#737373]">
            No donor registrations found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#737373] text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Blood Group</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {recentDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#151515]">
                      {donor.full_name}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-[#D92735]">
                      {donor.blood_group}
                    </td>
                    <td className="py-3.5 px-3 text-[#666666]">
                      {donor.district}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          donor.status
                        )}`}
                      >
                        {donor.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#737373]">
                      {new Date(donor.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

