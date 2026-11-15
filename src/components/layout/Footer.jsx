import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HELPLINE_DISPLAY, getHelplineWhatsAppUrl } from '../../utils/whatsapp';

/**
 * Minimal Footer matching the Phase 01 specification:
 * - Wordmark and brief description
 * - Core internal navigation
 * - Direct WhatsApp helpline contact
 * - Copyright statement
 */
export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) {
        const navOffset = 76;
        const targetPos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const navOffset = 76;
          const targetPos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

  return (
    <footer id="contact" className="bg-white border-t border-[#EAEAEA] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 items-center md:items-start text-center md:text-left">
          {/* Brand Info */}
          <div className="max-w-md flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 focus-visible:outline-none"
            >
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#151515]">
                Blood Connect
              </span>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#D92735]">
                Kerala
              </span>
            </Link>
            <p className="mt-3 text-sm sm:text-base text-[#666666] leading-relaxed">
              Connecting voluntary blood donors across Kerala.
            </p>
          </div>

          {/* Navigation & Contact: Stacked vertically on mobile (Navigation first, Contact below it), side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-10 sm:gap-16 text-center md:text-left w-full md:w-auto">
            {/* 1. Quick Navigation (First on mobile) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#151515] mb-4">
                Navigation
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => handleScrollTo(e, 'home')}
                    className="text-[#666666] hover:text-[#151515] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleScrollTo(e, 'about')}
                    className="text-[#666666] hover:text-[#151515] transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#donors"
                    onClick={(e) => handleScrollTo(e, 'donors')}
                    className="text-[#666666] hover:text-[#151515] transition-colors"
                  >
                    Blood Donors
                  </a>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-[#666666] hover:text-[#151515] transition-colors"
                  >
                    Become a Donor
                  </Link>
                </li>
              </ul>
            </div>

            {/* 2. Direct Helpline Contact (Below Navigation on mobile) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#151515] mb-4">
                Contact
              </p>
              <div className="space-y-2 text-sm flex flex-col items-center md:items-start">
                <p className="text-[#666666] inline-flex items-center gap-1">
                  <span>WhatsApp:</span>
                  <a
                    href={getHelplineWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#151515] hover:text-[#D92735] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{HELPLINE_DISPLAY}</span>
                    <svg
                      className="w-3.5 h-3.5 opacity-60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                </p>
                <p className="text-xs text-[#737373]">
                  Voluntary Emergency Coordination Network
                </p>
              </div>

              {/* Admin Login Button */}
              <div className="mt-4 pt-3 border-t border-[#EAEAEA] w-full flex justify-center md:justify-start">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#151515] bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#EAEAEA] rounded-lg transition-colors cursor-pointer group"
                >
                  <span>Admin Login</span>
                  <svg
                    className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#D92735] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright - Most Last */}
        <div className="mt-12 pt-8 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373] text-center sm:text-left">
          <p className="order-2 sm:order-1">
            © 2026 Blood Connect Kerala. All rights reserved.
          </p>
          <p className="order-1 sm:order-2 text-center sm:text-right">
            Voluntary Citizen Initiative • Made for Kerala
          </p>
        </div>
      </div>
    </footer>
  );
}
