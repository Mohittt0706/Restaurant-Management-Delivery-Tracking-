import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Toast from '../components/common/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim() || !email.trim() || !password.trim()) {
      return;
    }

    // Trigger success notification (UI simulation only - no backend storage)
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-cult-charcoal flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Toast Notification (Reused Component) */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message="Registration Successful"
        duration={3000}
      />

      {/* Register Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-cult-espresso border border-cult-bronze p-8 md:p-10 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream mb-2">
            REGISTER
          </h1>
          <p className="font-tagline italic text-cult-warmgray text-base md:text-lg">
            Join the cult of extraordinary dining
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block font-body text-xs uppercase tracking-widest text-cult-warmgray mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-3 text-sm font-body outline-none focus:border-cult-ember transition-colors duration-300 placeholder:text-cult-warmgray/40"
            />
          </div>

          {/* Contact Number Field */}
          <div>
            <label
              htmlFor="contact"
              className="block font-body text-xs uppercase tracking-widest text-cult-warmgray mb-2"
            >
              Contact Number
            </label>
            <input
              id="contact"
              type="tel"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-3 text-sm font-body outline-none focus:border-cult-ember transition-colors duration-300 placeholder:text-cult-warmgray/40"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block font-body text-xs uppercase tracking-widest text-cult-warmgray mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-3 text-sm font-body outline-none focus:border-cult-ember transition-colors duration-300 placeholder:text-cult-warmgray/40"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block font-body text-xs uppercase tracking-widest text-cult-warmgray mb-2"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream pl-4 pr-12 py-3 text-sm font-body outline-none focus:border-cult-ember transition-colors duration-300 placeholder:text-cult-warmgray/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 z-20 text-cult-warmgray hover:text-cult-ember p-1.5 cursor-pointer transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Register Submit Button */}
          <button
            type="submit"
            className="w-full bg-cult-ember text-cult-cream py-3.5 px-6 font-body text-sm uppercase tracking-widest font-medium hover:bg-cult-deep-red transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cult-ember/20 active:scale-[0.99] mt-2"
          >
            Register
          </button>
        </form>
      </motion.div>
    </div>
  );
}
