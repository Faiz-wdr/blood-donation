import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin.jsx';
import Button from '../../components/ui/Button';
import useSEO from '../../hooks/useSEO';

/**
 * AdminLoginPage Component:
 * Minimal email/password authentication using Supabase Auth.
 * Authorizes user against the secure `admin_users` table before granting access.
 */
export default function AdminLoginPage() {
  useSEO({
    title: 'Admin Portal Login — Blood Connect Kerala',
    description: 'Secure administrative access for Blood Connect Kerala donor network management.',
    noindex: true,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, isAuthenticated, loading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.error || 'Invalid credentials or unauthorized account.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 focus:outline-none">
            <span className="font-extrabold text-2xl tracking-tight text-[#151515]">
              Blood Connect
            </span>
            <span className="font-extrabold text-2xl tracking-tight text-[#D92735]">
              Kerala
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/[0.04]">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-start gap-2.5">
              <svg className="w-5 h-5 shrink-0 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-left">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                placeholder="admin@bloodconnectkerala.org"
                className="w-full px-4 py-3 text-sm sm:text-base bg-[#F5F5F5] text-[#151515] placeholder:text-[#999999] rounded-2xl border border-[#EAEAEA] hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 outline-none transition-all"
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 text-sm sm:text-base bg-[#F5F5F5] text-[#151515] placeholder:text-[#999999] rounded-2xl border border-[#EAEAEA] hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#737373] hover:text-[#151515] transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EAEAEA] text-center">
            <Link to="/" className="text-xs font-semibold text-[#737373] hover:text-[#151515] transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

