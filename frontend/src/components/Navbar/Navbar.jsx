import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingBag, Clock, MapPin, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const profileLinks = [
    { label: 'My Profile', to: '/profile', icon: User },
    { label: 'My Cart', to: '/cart', icon: ShoppingBag },
    { label: 'Active Order', to: '/orders/latest/tracking', icon: Clock },
    { label: 'Order History', to: '/order-history', icon: History },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cult-charcoal/95 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/cult-logo.jpg" alt="CULT Logo" className="w-9 h-9 object-cover rounded-full border border-cult-bronze/40" />
              <span className="font-display text-3xl lg:text-4xl tracking-widest text-cult-cream">
                CULT
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              <Link
                to="/"
                className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 relative group ${
                  location.pathname === '/'
                    ? 'text-cult-cream'
                    : 'text-cult-warmgray hover:text-cult-cream'
                }`}
              >
                About
                <span className={`absolute -bottom-1 left-0 h-px bg-cult-ember transition-all duration-300 ${
                  location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
              <Link
                to="/menu"
                className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 relative group ${
                  location.pathname === '/menu'
                    ? 'text-cult-cream'
                    : 'text-cult-warmgray hover:text-cult-cream'
                }`}
              >
                Menu
                <span className={`absolute -bottom-1 left-0 h-px bg-cult-ember transition-all duration-300 ${
                  location.pathname === '/menu' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </div>

            {/* Auth Controls + Mobile Toggle */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-cult-espresso/50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-cult-ember/20 border border-cult-ember/40 rounded-full flex items-center justify-center">
                      <User size={16} className="text-cult-ember" />
                    </div>
                    <span className="hidden lg:block font-body text-xs tracking-widest uppercase text-cult-warmgray">
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-cult-espresso border border-cult-bronze/30 shadow-xl shadow-black/30"
                      >
                        {/* User Info */}
                        <div className="p-4 border-b border-cult-bronze/20">
                          <p className="font-body text-sm font-bold text-cult-cream">{user?.name}</p>
                          <p className="font-body text-xs text-cult-warmgray truncate">{user?.email}</p>
                        </div>

                        {/* Links */}
                        <div className="py-1">
                          {profileLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 font-body text-xs tracking-wider uppercase text-cult-warmgray hover:text-cult-cream hover:bg-cult-charcoal/50 transition-all duration-200"
                              >
                                <Icon size={14} />
                                {link.label}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-cult-bronze/20 p-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 font-body text-xs tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-cult-charcoal/50 transition-all duration-200 w-full"
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-6">
                  <Link
                    to="/login"
                    className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                      location.pathname === '/login'
                        ? 'text-cult-cream'
                        : 'text-cult-warmgray hover:text-cult-cream'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="font-body text-xs tracking-widest uppercase px-5 py-2.5 bg-cult-ember text-cult-cream hover:bg-cult-deep-red transition-all duration-300"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-cult-cream p-2"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu onClose={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
