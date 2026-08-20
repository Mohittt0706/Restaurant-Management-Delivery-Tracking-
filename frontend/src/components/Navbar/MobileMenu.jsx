import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Clock, History, MapPin, LogOut } from 'lucide-react';
import { mobileMenuVariants } from '../../animations/variants';
import { useAuth } from '../../context/AuthContext';

export default function MobileMenu({ onClose }) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const publicLinks = [
    { label: 'About', to: '/' },
    { label: 'Menu', to: '/menu' },
  ];

  const authLinks = [
    { label: 'My Profile', to: '/profile', icon: User },
    { label: 'My Cart', to: '/cart', icon: ShoppingBag },
    { label: 'Active Order', to: '/orders/latest/tracking', icon: Clock },
    { label: 'Order History', to: '/order-history', icon: History },
  ];

  return (
    <motion.div
      variants={mobileMenuVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed inset-0 z-40 bg-cult-charcoal flex flex-col items-center justify-center gap-8"
    >
      {publicLinks.map((link, i) => (
        <motion.div
          key={link.to}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
        >
          <Link
            to={link.to}
            onClick={onClose}
            className="font-display text-4xl tracking-widest uppercase text-cult-cream hover:text-cult-ember transition-colors duration-300"
          >
            {link.label}
          </Link>
        </motion.div>
      ))}

      {isAuthenticated && authLinks.map((link, i) => {
        const Icon = link.icon;
        return (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (publicLinks.length + i) * 0.08, duration: 0.4 }}
          >
            <Link
              to={link.to}
              onClick={onClose}
              className="font-display text-4xl tracking-widest uppercase text-cult-cream hover:text-cult-ember transition-colors duration-300 inline-flex items-center gap-3"
            >
              <Icon size={28} />
              {link.label}
            </Link>
          </motion.div>
        );
      })}

      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + (publicLinks.length + authLinks.length) * 0.08, duration: 0.4 }}
        >
          <button
            onClick={handleLogout}
            className="font-display text-4xl tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors duration-300 inline-flex items-center gap-3"
          >
            <LogOut size={28} />
            Logout
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + publicLinks.length * 0.08, duration: 0.4 }}
          >
            <Link
              to="/login"
              onClick={onClose}
              className="font-display text-4xl tracking-widest uppercase text-cult-cream hover:text-cult-ember transition-colors duration-300"
            >
              Login
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (publicLinks.length + 1) * 0.08, duration: 0.4 }}
          >
            <Link
              to="/register"
              onClick={onClose}
              className="font-display text-4xl tracking-widest uppercase text-cult-ember hover:text-cult-cream transition-colors duration-300"
            >
              Register
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
