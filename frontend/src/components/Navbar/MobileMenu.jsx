import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mobileMenuVariants } from '../../animations/variants';

export default function MobileMenu({ links, onClose }) {
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
    </motion.div>
  );
}
