import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, LogOut } from 'lucide-react';
import { mobileMenuVariants } from '../../animations/variants';
import { useCart } from '../../context/CartContext';

export default function MobileMenu({ links, onClose, onLogout }) {
  const { itemCount } = useCart();

  return (
    <motion.div
      variants={mobileMenuVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed inset-0 z-40 bg-cult-charcoal flex flex-col items-center justify-center gap-10"
    >
      {links.map((link, i) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + links.length * 0.08, duration: 0.4 }}
      >
        <Link
          to="/cart"
          onClick={onClose}
          className="font-display text-4xl tracking-widest uppercase text-cult-cream hover:text-cult-ember transition-colors duration-300 inline-flex items-center gap-3"
        >
          Cart
          {itemCount > 0 && (
            <span className="w-7 h-7 bg-cult-ember text-cult-cream text-sm font-body font-bold flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
        </Link>
      </motion.div>

      {onLogout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + (links.length + 1) * 0.08, duration: 0.4 }}
        >
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="font-display text-4xl tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors duration-300 inline-flex items-center gap-3 cursor-pointer"
          >
            <LogOut size={28} />
            Logout
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
