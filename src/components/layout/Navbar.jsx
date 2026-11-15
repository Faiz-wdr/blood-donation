import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * Minimal, responsive sticky Navbar:
 * - Pure typographic logo (no icons, no emojis)
 * - Navigation links supporting multi-page routing
 * - "Become a Donor" navigates to /register
 * - Mobile drawer with CSS-only hamburger toggle
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'donors', 'become-a-donor'];
      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isHomePage) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navOffset = 76;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const navOffset = 76;
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

  const handleRequestBloodClick = (e) => {
    e?.preventDefault();
    setMobileMenuOpen(false);

    const scrollToHero = () => {
      const searchEl = document.getElementById('search') || document.getElementById('home');
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (isHomePage) {
      scrollToHero();
    } else {
      navigate('/');
      setTimeout(scrollToHero, 150);
    }
  };

  const handleBecomeDonorClick = (e) => {
    setMobileMenuOpen(false);

    if (location.pathname === '/register') {
      e?.preventDefault();
      const el = document.getElementById('donor-registration-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/register');
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Blood Donors', id: 'donors' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 border-b ${
        scrolled ? 'border-[#EAEAEA] shadow-xs' : 'border-[#F0F0F0]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Typographic Wordmark */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D92735] rounded-sm group"
            >
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#151515]">
                Blood Connect
              </span>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#D92735]">
                Kerala
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive =
                isHomePage &&
                (activeSection === link.id ||
                  (link.id === 'contact' && activeSection === 'footer'));
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-150 ${
                    isActive
                      ? 'text-[#151515] bg-[#F5F5F5] font-semibold'
                      : 'text-[#666666] hover:text-[#151515] hover:bg-[#F9F9F9]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right: Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
            <Button
              as="a"
              href="/#search"
              onClick={handleRequestBloodClick}
              variant="outline"
              size="md"
              className="font-medium text-xs sm:text-sm"
            >
              Request Blood
            </Button>
            <Button
              as={Link}
              to="/register"
              onClick={handleBecomeDonorClick}
              variant="primary"
              size="md"
              className="font-medium text-xs sm:text-sm"
            >
              Become a Donor
            </Button>
          </div>

          {/* Mobile Right Controls: Become a Donor mini CTA + CSS Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              as={Link}
              to="/register"
              onClick={handleBecomeDonorClick}
              variant="primary"
              size="sm"
              className="text-xs px-3 py-1.5"
            >
              Join
            </Button>

            {/* CSS-Only Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#151515] hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D92735] transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-[#151515] rounded-full transition-all duration-300 origin-center ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-[#151515] rounded-full transition-all duration-200 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-[#151515] rounded-full transition-all duration-300 origin-center ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="px-3.5 py-3 text-base font-medium rounded-xl text-[#151515] hover:bg-[#F5F5F5] active:bg-[#EBEBEB] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#EAEAEA] flex flex-col gap-2.5">
            <Button
              as="a"
              href="/#search"
              onClick={handleRequestBloodClick}
              variant="outline"
              size="md"
              className="w-full justify-center"
            >
              Request Blood
            </Button>
            <Button
              as={Link}
              to="/register"
              onClick={handleBecomeDonorClick}
              variant="primary"
              size="md"
              className="w-full justify-center"
            >
              Become a Donor
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
