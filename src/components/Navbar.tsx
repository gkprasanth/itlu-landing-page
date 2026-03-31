import { useState, useEffect } from "react";
import "../Navbar.css";
import { Link } from "react-router-dom";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";

const baseNavItems = [
  { label: "HOME", href: "/", order: 1 },
  { label: "ABOUT", href: "#about-sec", order: 2 },
  { label: "MENU", href: "#menu-sec", order: 3 },
  { label: "Catering", href: "#catering-sec", order: 4 },
  { label: "Gallery", href: "#gallery-sec-1", order: 5 },
  { label: "Testimonials", href: "#testi-sec", order: 6 },
  { label: "FAQs", href: "#faq-sec", order: 7 },
  { label: "CONTACT", href: "#contact-sec", order: 8 },
];

function Navbar({ value }: { value?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItemsRemote, setNavItemsRemote] = useState<Array<{ label: string; href: string; order?: number }> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await apiGet<{ label: string; href: string; order?: number }[]>(endpoints.navbar);
        setNavItemsRemote(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (err) {
        console.warn("Failed to load navbar items:", err);
      }
    })();
  }, []);

  const sourceNav = navItemsRemote && navItemsRemote.length > 0 ? navItemsRemote : baseNavItems;
  const navItems = value === true ? sourceNav : sourceNav.map((it) => ({ ...it, href: "/" }));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <header className="th-header header-default">
        <div className="sticky-wrapper">
          <div className="menu-area bg-[#3F9065] py-2">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <a href="/">
                    <img
                      src="assets/img/logo.png"
                      className="h-20 w-20 md:h-24 md:w-24"
                      alt="Itlu"
                      onError={onImgErrorFallback("assets/img/logo.png")}
                    />
                  </a>
                </div>

                {/* Desktop Menu - Centered */}
                <nav className="hidden lg:flex flex-1 justify-center">
                  <ul className="flex gap-6 list-none m-0 p-0" style={{ fontFamily: 'var(--title-font)' }}>
                    {navItems.map((item) => (
                      <li key={item.label} className="list-none">
                        <a className="text-white font-semibold hover:text-[#FFD700] transition uppercase" href={item.href}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Desktop Order Now Button - Right Side */}
                <div className="hidden lg:flex flex-shrink-0">
                  <Link
                    to="/menu"
                    className="order-now-btn-custom"
                  >
                    Order Now
                  </Link>
                </div>

                {/* Mobile - Hamburger Only */}
                <div className="lg:hidden flex items-center">
                  <button
                    type="button"
                    className="flex items-center justify-center bg-transparent rounded-full min-w-[48px] min-h-[48px] w-12 h-12 border-2 border-[#FFD700] hover:bg-[#FFD700]/10 transition p-0"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                    style={{ borderRadius: '50%' }}
                  >
                    <i className="far fa-bars text-white text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-menu-wrapper ${isMobileMenuOpen ? "active" : ""}`}
      >
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        <div className="mobile-menu-container">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <img src="assets/img/logo.png" alt="Itlu" onError={onImgErrorFallback("assets/img/logo.png")} />
            </div>
            <button className="mobile-menu-close" onClick={closeMobileMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav className="mobile-menu-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={closeMobileMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu-footer">
            <Link to="/menu" className="order-now-btn" onClick={closeMobileMenu}>
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
