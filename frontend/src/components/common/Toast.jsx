import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ isVisible, onClose, message = "Login Successful", duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-cult-espresso border border-cult-bronze border-l-4 border-l-cult-ember text-cult-cream px-5 py-4 shadow-2xl shadow-black/50 rounded-sm min-w-[280px]"
        >
          <CheckCircle2 className="w-5 h-5 text-cult-ember shrink-0" />
          <span className="font-body text-sm font-medium tracking-wide flex-1 text-cult-cream">
            {message}
          </span>
          <button
            onClick={onClose}
            className="text-cult-warmgray hover:text-cult-cream transition-colors duration-200 p-1"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
