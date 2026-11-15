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
              <div className="space-y-1.5 text-sm flex flex-col items-center md:items-start">
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
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
                <p className="text-xs text-[#737373]">
                  Yasir Adany Panakkad
                </p>

                {/* WhatsApp Community & Instagram Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href="https://chat.whatsapp.com/E59c8zTuf3wGgM3qwvf52E?s=cl&p=a&mlu=2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 h-8 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] rounded-full transition-all duration-150 cursor-pointer shadow-2xs"
                  >
                    <svg
                      className="w-4 h-4 shrink-0 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 10.3c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.3" />
                    </svg>
                    <span>Join Community</span>
                  </a>

                  <a
                    href="https://www.instagram.com/bloodconnect.kerala?igsh=bmYxODZkOXV3aXox"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#EAEAEA] text-[#151515] hover:text-[#E4405F] transition-all duration-150 cursor-pointer shadow-2xs group"
                  >
                    <svg
                      className="w-4 h-4 shrink-0 fill-current group-hover:scale-105 transition-transform"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Admin Login Button */}
              <div className="mt-4 pt-3 border-t border-[#EAEAEA] w-full flex justify-center md:justify-start">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3.5 h-8 text-xs font-semibold text-[#151515] bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#EAEAEA] rounded-full transition-all duration-150 cursor-pointer shadow-2xs group"
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
